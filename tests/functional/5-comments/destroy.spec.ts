import { TestContext } from '@japa/runner'
import { BASE_URL, postComment } from './_data'
import HTTP from 'http-status-enum'
import { ApiClient } from '@japa/api-client/build/src/client'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testDELETEAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType, deleteWithAuth } from '../_utils/basic-auth-requests'

async function testCommentUpdate({ client }: TestContext): Promise<void> {
  const adminComment = await postComment(client, ConnectionType.Admin)
  const nonAdminComment = await postComment(client, ConnectionType.NonAdmin)

  await testDELETEUnauthenticated(client, BASE_URL, adminComment.id)
  await testDELETEUndefinedId(client, BASE_URL)

  await testPutOthersComment(client, BASE_URL, adminComment.id, ConnectionType.NonAdmin)
  await testPutOthersComment(client, BASE_URL, nonAdminComment.id, ConnectionType.Admin)

  await testDELETEAccepted(client, BASE_URL, adminComment.id, ConnectionType.Admin)
  await testDELETEAccepted(client, BASE_URL, nonAdminComment.id, ConnectionType.NonAdmin)
}

async function testPutOthersComment(client: ApiClient, url: string, commentId: number, connectionType: ConnectionType): Promise<void> {
  let response = await deleteWithAuth(`${url}/${commentId}`, client, connectionType)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBody({ error: 'CantDeleteOthersWrite' })
}

export default testCommentUpdate