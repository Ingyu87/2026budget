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
  $summary = (Remove-IdentifyingText $row.활동요약) -replace "\s+", " "
  $detail = Remove-IdentifyingText $row.상세활동내용
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
