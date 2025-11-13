export type TestCase = {
  id?: number
  testerName: string
  testCaseTitle: string
  description: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  category: string
  severity: string
  commitVer: string
  date: string
  module?: string
}
