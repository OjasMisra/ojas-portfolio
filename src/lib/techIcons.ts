/**
 * Maps a skill / stack name to a real brand icon from `simple-icons`.
 * Only named imports are used, so the bundle ships just these icons — not the
 * whole set. Names without an available icon (Tableau, Power BI, Azure, AWS,
 * dbt — pulled from simple-icons for trademark reasons) simply render as text.
 */
import {
  siPython,
  siSnowflake,
  siDocker,
  siApacheairflow,
  siApachespark,
  siPandas,
  siNumpy,
  siScikitlearn,
  siGit,
  siJira,
  siOpencv,
  siDatabricks,
  siMysql,
  siApachekafka,
  siGithubactions,
} from 'simple-icons'

export interface TechIcon {
  path: string
  hex: string
  title: string
}

// Keyed by the base name (version suffixes like "Airflow 2.8" are stripped below).
const MAP: Record<string, TechIcon> = {
  Python: siPython,
  'SQL (MySQL / SQL Server / PL-SQL)': siMysql,
  MySQL: siMysql,
  'Spark SQL': siApachespark,
  'Apache Spark': siApachespark,
  Spark: siApachespark,
  PySpark: siApachespark,
  Snowflake: siSnowflake,
  'Snowflake Cortex AI': siSnowflake,
  'Cortex AI': siSnowflake,
  Airflow: siApacheairflow,
  'Apache Airflow': siApacheairflow,
  Databricks: siDatabricks,
  Docker: siDocker,
  'scikit-learn': siScikitlearn,
  Pandas: siPandas,
  NumPy: siNumpy,
  OpenCV: siOpencv,
  'Apache Kafka': siApachekafka,
  Kafka: siApachekafka,
  Git: siGit,
  JIRA: siJira,
  'CI/CD': siGithubactions,
}

/** Strip a trailing version number, e.g. "Airflow 2.8" -> "Airflow". */
function baseName(name: string): string {
  return name.replace(/\s*\d[\d.]*$/, '').trim()
}

export function getTechIcon(name: string): TechIcon | undefined {
  return MAP[name] ?? MAP[baseName(name)]
}
