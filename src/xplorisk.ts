/// <reference lib="dom" />

import * as dotenv from 'dotenv'
dotenv.config()

export enum RiskScore {
  LOW = 'low',
  MED = 'med',
  HIGH = 'high'
}

export const RiskScore2String: { [riskScore: string]: string } = {
  [RiskScore.LOW]: 'low',
  [RiskScore.MED]: 'medium',
  [RiskScore.HIGH]: 'high'
}

export type RiskResult = {
  address: string
  name: string
  classification: Array<string>
  risk_factors: Array<string>
  risk_score: RiskScore
}

export const getRisk = async (
  addresses: Array<string>
): Promise<Array<RiskResult>> => {
  if (!addresses.length) {
    throw new Error('Must provide at least one address to check')
  }
  const response: Response = await fetch(process.env.XPLORISK_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addresses
    })
  })

  if (response.ok) {
    const json = await response.json()
    if (json.status === 'fail') {
      throw new Error(json.error ?? 'Unexpected error occured')
    }
    return json as Array<RiskResult>
  } else {
    const statusText: string = await response.text()
    throw new Error(`HTTP error!: ${response.status} ${statusText}`)
  }
}
