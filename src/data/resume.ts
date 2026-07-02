/**
 * Single source of truth for all portfolio content.
 * Every visible fact on the site comes from here. Edit this file to update the site.
 * The SQL console (lib/queryEngine.ts) queries the `tables` export below.
 */

export interface Profile {
  name: string
  title: string
  tagline: string
  location: string
  phone: string
  email: string
  linkedin: string
  github: string
  status: string
}

export const profile: Profile = {
  name: 'Ojas Misra',
  title: 'Data Engineer / Analyst',
  tagline: 'Pipelines, semantic modeling, BI, and LLM-powered data products.',
  location: 'Boston, MA',
  phone: '(617) 606-2254',
  email: 'misra.o@northeastern.edu',
  linkedin: 'https://linkedin.com/in/ojas-misra',
  github: 'https://github.com/OjasMisra',
  status: 'MS Information Systems @ Northeastern — graduating Aug 2026',
}

/** ETL stage each role maps to, for the career pipeline visualization. */
export type Stage = 'Extract' | 'Transform' | 'Load'

/** Brand-colored monogram badge shown on each role (avoids shipping trademarked logo files). */
export interface Brand {
  mark: string
  bg: string
  fg: string
}

export interface Experience {
  company: string
  role: string
  period: string
  start: number // year, for ORDER BY
  stage: Stage
  impact_pct: number // headline impact figure, for WHERE impact_pct > N
  location: string
  brand: Brand
  highlights: string[]
  stack: string[]
}

export const experience: Experience[] = [
  {
    company: 'Fidelity Investments',
    role: 'Data Analyst Co-op',
    period: 'Jul–Dec 2025',
    start: 2025,
    stage: 'Load',
    impact_pct: 30,
    location: 'Boston, MA',
    brand: { mark: 'F', bg: '#4C9E2F', fg: '#FFFFFF' },
    highlights: [
      'Built Snowflake semantic models standardizing 20+ KPIs for 15+ stakeholders, cutting ad-hoc requests ~30%.',
      'Automated reporting and QA with Python + Cron on Snowflake.',
      'Shipped SQL + Tableau dashboards with 40%+ faster load times.',
      'Drove KPI definition and governance with Alation and SnowSQL.',
    ],
    stack: ['Snowflake', 'Python', 'SQL', 'Tableau', 'Alation', 'SnowSQL', 'Cron'],
  },
  {
    company: 'Ernst & Young (EY)',
    role: 'Software Engineer',
    period: 'Jan 2022–Aug 2024',
    start: 2022,
    stage: 'Transform',
    impact_pct: 80,
    location: 'India',
    brand: { mark: 'EY', bg: '#2E2E38', fg: '#FFE600' },
    highlights: [
      'Owned end-to-end ETL in Azure Data Factory, achieving 80% faster processing.',
      'Built PySpark / Spark SQL transformations on Databricks with Delta Lake + Iceberg.',
      'Cut Power BI load time 40% via clustered column indexing.',
      'Designed dimensional & relational models with DAX and M-Query.',
      'Built staging / dim / fact tables and stored procedures in SSMS.',
    ],
    stack: [
      'Azure Data Factory',
      'Databricks',
      'PySpark',
      'Spark SQL',
      'Delta Lake',
      'Iceberg',
      'Power BI',
      'DAX',
      'M-Query',
      'SSMS',
    ],
  },
  {
    company: 'Orange Business',
    role: 'Trainee',
    period: 'Apr–Oct 2021',
    start: 2021,
    stage: 'Extract',
    impact_pct: 0,
    location: 'India',
    brand: { mark: 'O', bg: '#FF7900', fg: '#FFFFFF' },
    highlights: [
      'Built Python RPA automating data extraction, saving 100+ man-hours.',
      'Surfaced deal-health insights from the extracted data.',
    ],
    stack: ['Python', 'RPA', 'Automation'],
  },
]

export interface Project {
  id: string
  project: string
  blurb: string
  has_llm: boolean
  featured: boolean
  year: number
  repo: string
  stack: string[]
  architecture: string[] // ordered pipeline stages, for the arch diagram vibe
  metrics: { label: string; value: string }[]
  details: string[]
}

export const projects: Project[] = [
  {
    id: 'finsage',
    project: 'FinSage',
    blurb:
      'AI-powered equity research platform — generates 15–20 page, cited research reports for any U.S. public company in under 7 minutes.',
    has_llm: true,
    featured: true,
    year: 2026,
    repo: 'https://github.com/OjasMisra/FinSage',
    stack: [
      'Snowflake',
      'Cortex AI',
      'dbt 1.7',
      'Airflow 2.8',
      'Docker',
      'AWS Bedrock',
      'AWS S3',
      'Terraform',
      'Next.js 16',
      'FastAPI',
      'TypeScript',
    ],
    architecture: [
      'Ingest — prices, fundamentals, NewsAPI, 10-K/10-Q, XBRL',
      'RAW → STAGING (dbt views) → ANALYTICS (tested tables)',
      'CAVM multi-agent pipeline',
      'Branded PDF research report',
    ],
    metrics: [
      { label: 'report time', value: '<7 min' },
      { label: 'data sources', value: '5' },
      { label: 'chart types', value: '8' },
      { label: 'tickers', value: '50+' },
    ],
    details: [
      'CAVM pipeline coordinates four agents: a Chart Agent (8 matplotlib visuals with a 3-iteration vision-critique refinement loop), a Validation Agent (independently verifies chart quality, aborts if >2 fail), an Analysis Agent (per-chart commentary + SEC MD&A summaries), and a Report Agent (assembles the branded PDF).',
      'Snowflake Cortex runs claude-sonnet-4-6 for vision refinement and mistral-large for analysis, with SUMMARIZE + SENTIMENT tools.',
      'AWS Bedrock hosts a Llama 3 Knowledge-Base RAG with citations and Guardrails that block investment advice and redact PII.',
      'Idempotent MERGE loads, incremental fetching with exponential backoff, and 0–100 data-quality scoring across the warehouse.',
      'dbt: 5 staging views + 6 tested analytics tables; Airflow DAG orchestrated on Docker Compose; S3 infra as code via Terraform.',
    ],
  },
  {
    id: 'aqi',
    project: 'AQI Prediction',
    blurb:
      'End-to-end air-quality predictor: scrape weather data, train a model, serve predictions from a deployed web app.',
    has_llm: false,
    featured: false,
    year: 2022,
    repo: 'https://github.com/OjasMisra/Boston_AQI_Predictor',
    stack: ['Python', 'BeautifulSoup', 'scikit-learn', 'Random Forest', 'Flask', 'Heroku'],
    architecture: [
      'Scrape weather data (BeautifulSoup)',
      'Train Random Forest (RandomizedSearchCV)',
      'Serve via Flask on Heroku',
    ],
    metrics: [
      { label: 'model accuracy', value: '72%' },
      { label: 'model', value: 'Random Forest' },
      { label: 'tuning', value: 'RandomizedSearchCV' },
    ],
    details: [
      'Scraped weather data with BeautifulSoup as the feature source.',
      'Trained a Random Forest reaching 72% accuracy, tuned with RandomizedSearchCV.',
      'Deployed the model behind a Flask web app on Heroku.',
    ],
  },
  {
    id: 'imdb',
    project: 'IMDb BI Pipeline',
    blurb:
      'End-to-end BI pipeline turning 7 raw IMDb datasets into a dimensional Snowflake warehouse and Power BI dashboards satisfying 15+ business requirements.',
    has_llm: false,
    featured: false,
    year: 2025,
    repo: 'https://github.com/OjasMisra/IMDb-BI_Pipeline-Analytics',
    stack: ['Azure Data Factory', 'Snowflake', 'Python', 'PL/SQL', 'Power BI'],
    architecture: [
      'Clean 7 raw datasets (Python)',
      'Stage load → Snowflake (ADF)',
      'Dimensional model — dims + facts',
      'Power BI dashboard',
    ],
    metrics: [
      { label: 'raw datasets', value: '7' },
      { label: 'business reqs', value: '15+' },
      { label: 'warehouse', value: 'Snowflake' },
    ],
    details: [],
  },
  {
    id: 'streaming',
    project: 'Real-Time Streaming Pipeline',
    blurb:
      'Distributed real-time data processing pipeline — Kafka for streaming ingestion, Spark for transformation, containerized with Docker for scalable deployment.',
    has_llm: false,
    featured: false,
    year: 2025,
    repo: 'https://github.com/OjasMisra/Distributed_Real-Time_Data_Processing_System',
    stack: ['Apache Kafka', 'Apache Spark', 'Docker', 'Python', 'Airflow'],
    architecture: ['Kafka — stream ingestion', 'Spark — transformation', 'Docker Compose — orchestration'],
    metrics: [
      { label: 'ingestion', value: 'Kafka' },
      { label: 'processing', value: 'Spark' },
      { label: 'deploy', value: 'Docker' },
    ],
    details: [],
  },
  {
    id: 'rail',
    project: 'Rail Ticketing Database',
    blurb:
      'Normalized relational database for railway ticketing — passengers, trains, routes, seat availability, fares and refunds — with stored procedures and an ERD.',
    has_llm: false,
    featured: false,
    year: 2024,
    repo: 'https://github.com/OjasMisra/Rail_Ticketing_Relational_Database_System',
    stack: ['MySQL', 'SQL', 'Stored Procedures', 'ERD'],
    architecture: ['Normalized schema (13 entities)', 'Stored procedures & functions', 'Seat availability + refund rules'],
    metrics: [
      { label: 'core tables', value: '13' },
      { label: 'engine', value: 'MySQL' },
      { label: 'design', value: '3NF + ERD' },
    ],
    details: [],
  },
  {
    id: 'color',
    project: 'Color Identification in Images',
    blurb:
      'Unsupervised KMeans model that filters a folder of images by a specified dominant color.',
    has_llm: false,
    featured: false,
    year: 2021,
    repo: 'https://github.com/OjasMisra/Color_Identification_In_Images',
    stack: ['Python', 'scikit-learn', 'NumPy'],
    architecture: ['Extract pixel colors', 'KMeans clustering', 'Filter images by color'],
    metrics: [
      { label: 'model', value: 'KMeans' },
      { label: 'type', value: 'Unsupervised' },
    ],
    details: [],
  },
]

export interface Skill {
  skill: string
  category: string
  level: number // self-rated proficiency 0–100, for ORDER BY / bar viz
}

export const skills: Skill[] = [
  // Languages & query
  { skill: 'Python', category: 'Languages & Query', level: 95 },
  { skill: 'SQL (MySQL / SQL Server / PL-SQL)', category: 'Languages & Query', level: 95 },
  { skill: 'Spark SQL', category: 'Languages & Query', level: 82 },
  { skill: 'DAX', category: 'Languages & Query', level: 80 },
  { skill: 'M-Query', category: 'Languages & Query', level: 78 },
  // Data engineering
  { skill: 'Snowflake', category: 'Data Engineering', level: 92 },
  { skill: 'dbt', category: 'Data Engineering', level: 85 },
  { skill: 'Airflow', category: 'Data Engineering', level: 83 },
  { skill: 'PySpark', category: 'Data Engineering', level: 85 },
  { skill: 'Azure Data Factory', category: 'Data Engineering', level: 88 },
  // Platforms & cloud
  { skill: 'Databricks', category: 'Platforms & Cloud', level: 85 },
  { skill: 'Delta Lake', category: 'Platforms & Cloud', level: 80 },
  { skill: 'Iceberg', category: 'Platforms & Cloud', level: 72 },
  { skill: 'AWS S3', category: 'Platforms & Cloud', level: 78 },
  { skill: 'Docker', category: 'Platforms & Cloud', level: 80 },
  // BI & modeling
  { skill: 'Power BI', category: 'BI & Modeling', level: 90 },
  { skill: 'Tableau', category: 'BI & Modeling', level: 88 },
  { skill: 'Semantic & dimensional modeling', category: 'BI & Modeling', level: 88 },
  { skill: 'Alation', category: 'BI & Modeling', level: 75 },
  // AI / ML
  { skill: 'Snowflake Cortex AI', category: 'AI / ML', level: 85 },
  { skill: 'LLM / VLM pipelines', category: 'AI / ML', level: 84 },
  { skill: 'scikit-learn', category: 'AI / ML', level: 82 },
  { skill: 'Pandas', category: 'AI / ML', level: 92 },
  { skill: 'NumPy', category: 'AI / ML', level: 88 },
  { skill: 'OpenCV', category: 'AI / ML', level: 70 },
  // Workflow
  { skill: 'Git', category: 'Workflow', level: 90 },
  { skill: 'Azure DevOps', category: 'Workflow', level: 82 },
  { skill: 'JIRA', category: 'Workflow', level: 85 },
  { skill: 'CI/CD', category: 'Workflow', level: 80 },
]

export interface Education {
  degree: string
  school: string
  year: string
  note: string
}

export const education: Education[] = [
  {
    degree: 'M.S. Information Systems',
    school: 'Northeastern University',
    year: '2024 – Aug 2026',
    note: 'Boston, MA',
  },
  {
    degree: 'B.E. Computer Science',
    school: 'Visvesvaraya Technological University (VTU)',
    year: '2021',
    note: 'India',
  },
]

export interface Award {
  award: string
  detail: string
}

export const awards: Award[] = [
  { award: 'EY Bronze Badge — Data Visualization', detail: 'Ernst & Young' },
  { award: 'EY Bronze Badge — Data Integration', detail: 'Ernst & Young' },
  { award: 'EY Bronze Badge — AI Engineering', detail: 'Ernst & Young' },
  { award: '2× Spot Awards', detail: 'Ernst & Young' },
  { award: 'Client Appreciation', detail: 'Ernst & Young' },
]

/** Headline numbers for the animated metric tiles + the metrics table. */
export interface Metric {
  metric: string
  value: number
  suffix: string
  prefix: string
  context: string
}

export const metrics: Metric[] = [
  { metric: 'ad_hoc_requests_cut', value: 30, suffix: '%', prefix: '', context: 'fewer ad-hoc requests at Fidelity via semantic models' },
  { metric: 'dashboard_speedup', value: 40, suffix: '%+', prefix: '', context: 'faster dashboard / Power BI load times' },
  { metric: 'etl_speedup', value: 80, suffix: '%', prefix: '', context: 'faster ETL processing in Azure Data Factory' },
  { metric: 'hours_saved', value: 100, suffix: '+', prefix: '', context: 'man-hours saved by RPA automation at Orange' },
  { metric: 'sec_data_points', value: 1600, suffix: '+', prefix: '', context: 'SEC EDGAR XBRL data points ingested per ticker in FinSage' },
  { metric: 'kpis_standardized', value: 20, suffix: '+', prefix: '', context: 'KPIs standardized for 15+ stakeholders' },
]

/** Easter-egg table — keep it playful, keep it real. */
export interface Fuel {
  coffee: string
  current_song: string
  ide: string
  guilty_pleasure_query: string
  status: string
}

export const fuel: Fuel[] = [
  {
    coffee: 'oat-milk cortado, double — the pipeline does not run on water',
    current_song: 'something with a 124 BPM build, on repeat',
    ide: 'VS Code, dark, JetBrains Mono, terminal always open',
    guilty_pleasure_query: 'SELECT * FROM prod ORDER BY created_at DESC LIMIT 1; (just to check)',
    status: 'caffeinated and committing',
  },
]
