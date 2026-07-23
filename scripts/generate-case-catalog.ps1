param(
  [string]$SourceCsv = "..\outputs\2026_AI디지털_선도학교_사례나눔_과제별_상세분석.csv",
  [string]$OutputFile = "app\case-catalog-data.ts"
)

$ErrorActionPreference = "Stop"

$resolvedSource = Resolve-Path -LiteralPath $SourceCsv
$sourceRows = Import-Csv -LiteralPath $resolvedSource
$schoolNames = $sourceRows.학교명 | Where-Object { $_ } | Sort-Object -Unique
$taskMap = @{
  "필수과제1" = "required1"
  "필수과제2" = "required2"
  "필수과제3" = "required3"
  "선택과제" = "optional"
}
$taskLabels = @{
  "required1" = "필수과제 1 · 배움전환"
  "required2" = "필수과제 2 · 관계전환"
  "required3" = "필수과제 3 · 인식전환"
  "optional" = "선택과제"
}
$taskCounters = @{
  "required1" = 0
  "required2" = 0
  "required3" = 0
  "optional" = 0
}
$blockedKeywordPatterns = @(
  "이건하지마",
  "안지워도된다",
  "시켜$",
  "추천$"
)

function Remove-IdentifyingText {
  param([AllowEmptyString()][string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return ""
  }

  $cleaned = $Value
  foreach ($schoolName in $schoolNames) {
    $cleaned = $cleaned.Replace($schoolName, "")
  }
  $cleaned = $cleaned.Replace("학교명", "")
  $cleaned = $cleaned -replace "`r`n", "`n"
  $cleaned = $cleaned -replace "[ \t]+", " "
  $cleaned = $cleaned -replace " *`n *", "`n"
  return $cleaned.Trim()
}

function Normalize-ExtractedText {
  param([AllowEmptyString()][string]$Value)

  $cleaned = Remove-IdentifyingText $Value
  if ([string]::IsNullOrWhiteSpace($cleaned)) {
    return ""
  }

  # PDF 줄 끝에서 생긴 강제 개행은 화면의 자연스러운 줄바꿈에 맡긴다.
  $cleaned = $cleaned -replace "\s+", " "

  # 조사·어미 앞에서 단어가 끊긴 추출 오류를 복원한다.
  $suffixPattern = "은|는|이|가|을|를|과|와|의|에|에서|에게|한테|께|로|으로|도|만|부터|까지|보다|처럼|며|고|거나|도록|지만|는데|면서|였으며|였고|였습니다|였다|합니다|하였다|했다|하는|하여|하고|해도|해야|된|되는|되며|습니다|니다|함|음|들이|들은|들의|들을|에게"
  $cleaned = $cleaned -replace "([가-힣])\s+($suffixPattern)(?=\s|[.,!?;:'""()\[\]]|$)", '$1$2'

  # 한글 단어 중간에서 한 음절이 분리된 대표적인 PDF 추출 오류를 복원한다.
  $wordRepairs = @{
    "아 바타" = "아바타"
    "유 행" = "유행"
    "국 어" = "국어"
    "수 학" = "수학"
    "과 학" = "과학"
    "사 회" = "사회"
    "학 생" = "학생"
    "교 사" = "교사"
    "에듀테 크" = "에듀테크"
    "피드 백" = "피드백"
    "디 지털" = "디지털"
    "디지 털" = "디지털"
    "도 구" = "도구"
    "통 해" = "통해"
    "맞 게" = "맞게"
    "맞 춤형" = "맞춤형"
    "젭 퀴즈" = "젭퀴즈"
    "직 접" = "직접"
    "기 반" = "기반"
    "글 쓰기" = "글쓰기"
    "학 습" = "학습"
    "운 영" = "운영"
    "사 례" = "사례"
    "주 도" = "주도"
    "수 업" = "수업"
    "문 화" = "문화"
    "바 탕" = "바탕"
    "단 원" = "단원"
    "코 딩" = "코딩"
    "주 고받" = "주고받"
    "극 복" = "극복"
    "실 시간" = "실시간"
    "웹 앱" = "웹앱"
  }
  foreach ($brokenWord in $wordRepairs.Keys) {
    $cleaned = $cleaned.Replace($brokenWord, $wordRepairs[$brokenWord])
  }

  return $cleaned.Trim()
}

function Convert-ToList {
  param(
    [AllowEmptyString()][string]$Value,
    [string]$SeparatorPattern = "[,#]"
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return @()
  }

  return @(
    $Value -split $SeparatorPattern |
      ForEach-Object { (Remove-IdentifyingText $_).Trim().TrimStart("#") } |
      Where-Object { $_ } |
      Select-Object -Unique
  )
}

$catalog = foreach ($row in ($sourceRows | Where-Object { $_.검증상태 -eq "확인" })) {
  $taskKey = $taskMap[$row.과제구분]
  if (-not $taskKey) {
    continue
  }

  $taskCounters[$taskKey] += 1
  $keywords = @(
    Convert-ToList $row.핵심키워드 |
      Where-Object {
        $keyword = $_
        -not ($blockedKeywordPatterns | Where-Object { $keyword -match $_ })
      } |
      Select-Object -First 5
  )
  $tools = @(Convert-ToList $row.'활용도구·자료' "[,;/·]")
  $topics = @(Convert-ToList $row.분석주제 "[,;]")
  $summary = Normalize-ExtractedText $row.활동요약
  $detail = Normalize-ExtractedText $row.상세활동내용
  $titleParts = if ($keywords.Count -gt 0) {
    @($keywords | Select-Object -First 2)
  } elseif ($topics.Count -gt 0) {
    @($topics | Select-Object -First 2)
  } else {
    @("수업·운영 사례")
  }

  [ordered]@{
    id = "{0}-{1}" -f $taskKey, $taskCounters[$taskKey].ToString("000")
    task = $taskKey
    taskLabel = $taskLabels[$taskKey]
    title = $titleParts -join " · "
    summary = $summary
    detail = if ($detail) { $detail } else { $summary }
    keywords = $keywords
    tools = $tools
    topics = $topics
    optionalType = if ($taskKey -eq "optional") {
      Remove-IdentifyingText $row.선택과제유형
    } else {
      ""
    }
  }
}

$json = $catalog | ConvertTo-Json -Depth 6 -Compress
$typeHeader = @'
export type CaseCatalogTask = "required1" | "required2" | "required3" | "optional";

export type CaseCatalogItem = {
  id: string;
  task: CaseCatalogTask;
  taskLabel: string;
  title: string;
  summary: string;
  detail: string;
  keywords: string[];
  tools: string[];
  topics: string[];
  optionalType: string;
};

export const caseCatalog: CaseCatalogItem[] =
'@

$outputPath = Join-Path (Get-Location) $OutputFile
($typeHeader + $json + ";`n") | Set-Content -LiteralPath $outputPath -Encoding utf8
Write-Output "Generated $($catalog.Count) anonymized case cards at $outputPath"
