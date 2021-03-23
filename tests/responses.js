import '@babel/polyfill'

import assert from 'assert'
import buildRequest from '@feugene/layer-request'
// import WrapperInterceptor from '../src/response/WrapperInterceptor/WrapperInterceptor'
import WrapperInterceptor from '../src/response/WrapperInterceptor'
import isObject from '@feugene/mu/src/is/isObject'
import ResponseWrapper from '../src/response/WrapperInterceptor/ResponseWrapper'

describe('create Request with interceptoprs', () => {

  it('response wrapper interceptor with data key', async () => {

    const r = buildRequest()

    const layoutApi = r.manager.addLayer((cm) => cm.new({
      requestConfig: {
        baseURL: 'https://reqres.in/api',
        timeout: 30000,
      },
      interceptors: {
        response: [WrapperInterceptor()],
      },
    }))

    r.manager.addLayer(layoutApi, 'api')

    const l = r.manager.getLayer('api')

    assert.strictEqual(0, l.interceptors.request.length)
    assert.strictEqual(1, l.interceptors.response.length)

    const buildReq = r.build('api')
    assert.strictEqual(1, buildReq.interceptors.response.handlers.length)

    const response = await buildReq.get('users/2')
      .catch(err => {
        console.log('err >>  ', err)
      })

    assert.strictEqual(true, response instanceof ResponseWrapper)
    assert.strictEqual('data', response.config.dataKey)
    assert.strictEqual('entity', response.type)
    assert.strictEqual(2, response.data('id'))
    assert.strictEqual(true, isObject(response.extra('support')))

    const response2 = await r.build('api', { withoutDataBlock: true }).get('users/2')
      .catch(err => {
        console.log('err >>  ', err)
      })

    assert.strictEqual(true, response2 instanceof ResponseWrapper)
    assert.strictEqual('', response2.config.dataKey)
    assert.strictEqual('entity', response2.type)
    assert.strictEqual(2, response2.data('data.id'))
    assert.strictEqual(true, isObject(response2.data('data')))
    assert.strictEqual(true, isObject(response2.data('support')))
    assert.strictEqual(undefined, response2.extra('support'))
  })
/*
  it('response wrapper interceptor without data key', async () => {

    const r = buildRequest()

    const layoutApi = r.manager.addLayer((cm) => cm.new({
      requestConfig: {
        baseURL: 'https://reqres.in/api',
        timeout: 30000,
      },
      interceptors: {
        response: [WrapperInterceptor()],
      },
    }))

    r.manager.addLayer(layoutApi, 'api')

    const l = r.manager.getLayer('api')

    assert.strictEqual(0, l.interceptors.request.length)
    assert.strictEqual(1, l.interceptors.response.length)

    const buildReq = r.build('api')
    assert.strictEqual(1, buildReq.interceptors.response.handlers.length)

    const response = await buildReq.get('users/2')
      .catch(err => {
        console.log('err >>  ', err)
      })

    console.log(response.data('data.id'))
    assert.strictEqual(true, response instanceof ResponseWrapper)
    assert.strictEqual('data', response.config.dataKey)
    assert.strictEqual('entity', response.type)
    assert.strictEqual(2, response.data('data.id'))
    assert.strictEqual(true, isObject(response.data('data')))
    assert.strictEqual(true, isObject(response.data('support')))
    assert.strictEqual(undefined, response.extra('support'))
  })*/
})
