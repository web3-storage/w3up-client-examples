import { Authority } from '@ucanto/authority';
import * as CBOR from '@ucanto/transport/src/cbor';
// import * as HTTP from '@ucanto/transport/src/http'
import * as Client from '@ucanto/client';
import webfetch from 'cross-fetch';

// TODO: patch
import * as CAR from '../patches/@ucanto/transport/car.js';
import * as HTTP from '../patches/@ucanto/transport/http.js';

export * from './capability.js';

/**
 * @param {object} options
 * @param {API.DID} options.id
 * @param {URL} options.url
 * @param {string} [options.method]
 * @param {HTTP.Fetcher} [options.fetch]
 * @param {API.OutpboundTranpsortOptions} [options.transport]
 * @returns {API.ConnectionView<{store: API.Store.Store, identity: API.Identity.Identity }>}
 */
export const connect = ({
  id,
  url,
  transport = { encoder: CAR, decoder: CBOR },
  fetch = webfetch,
  method,
}) =>
  Client.connect({
    id: Authority.parse(id),
    ...transport,
    channel: HTTP.open({
      url,
      fetch,
      method,
    }),
  });
