import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ConnectionType, RequestFunction, deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testGETAccepted(
  client: ApiClient, url: string, connectionType: ConnectionType
): Promise<void> {
  const message = { message: 'SucessfullyRecovered' }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(getWithAuth, connectionType, message, http, client, url)
}

export async function testPOSTAccepted(
  client: ApiClient, url: string, body: object, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: 'SucessfullyCreated' }
  const http = HTTP.CREATED
  return await testREQUESTAccepted(postWithAuth, connectionType, message, http, client, url, body)
}

export async function testPUTAccepted(
  client: ApiClient, url: string, id: number, body: object, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: 'SucessfullyUpdated' }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(putWithAuth, connectionType, message, http, client, `${url}/${id}`, body)
}

export async function testDELETEAccepted(
  client: ApiClient, url: string, id: number, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: 'SucessfullyDestroyed' }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(deleteWithAuth, connectionType, message, http, client, `${url}/${id}`)
}

async function testREQUESTAccepted(
  requestFunction: RequestFunction, connectionType: ConnectionType, message: object,
  http: number, client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, connectionType, body)
  response.assertStatus(http)
  response.assertBodyContains(message)
}