pipeline {
  agent any
  tools { nodejs 'node20' }
  environment {
    DATABASE_URL = 'file:./dev-ci.db'
    NEXTAUTH_URL = 'http://localhost:3000'
    NEXTAUTH_SECRET = 'test_ci_secret'
    STRIPE_SECRET_KEY = 'sk_test_dummy'
    STRIPE_WEBHOOK_SECRET = 'whsec_dummy'
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }
    stage('Install PNPM'){ steps { sh 'corepack enable && corepack prepare pnpm@9 --activate' } }
    stage('Install deps'){ steps { sh 'pnpm install --frozen-lockfile' } }
    stage('Prisma'){ steps { sh 'pnpm prisma generate && pnpm db:push && pnpm db:seed' } }
    stage('Lint'){ steps { sh 'pnpm lint' } }
    stage('Typecheck'){ steps { sh 'pnpm -s tsc --noEmit' } }
    stage('Build'){ steps { sh 'pnpm build' } }
  }
}

