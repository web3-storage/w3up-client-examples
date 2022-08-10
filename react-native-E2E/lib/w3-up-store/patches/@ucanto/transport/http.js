import * as API from '@ucanto/interface';

/**
 * @typedef {{
 * ok: boolean
 * arrayBuffer():API.Await<ArrayBuffer>
 * headers: {
 *  entries():Iterable<[string, string]>
 * }
 * status?: number
 * statusText?: string
 * url?: string
 * }} FetchResponse
 * @typedef {(url:string, init:API.HTTPRequest<API.Tuple<API.ServiceInvocation>>) => API.Await<FetchResponse>} Fetcher
 */
/**
 * @template T
 * @param {object} options
 * @param {URL} options.url
 * @param {(url:string, init:API.HTTPRequest<API.Tuple<API.ServiceInvocation>>) => API.Await<FetchResponse>} [options.fetch]
 * @param {string} [options.method]
 * @returns {API.Channel<T>}
 */
export const open = ({ url, method = 'POST', fetch = globalThis.fetch }) => {
  if (typeof fetch === 'undefined') {
    throw new TypeError(
      `ucanto HTTP transport got undefined \`fetch\`. Try passing in a \`fetch\` implementation explicitly.`
    );
  }
  return new Channel({ url, method, fetch });
};

async function blobToBuffer(blob) {
  let reader = new FileReader();
  reader.readAsDataURL(blob); // converts ta blob to base64 and calls onload

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      const b64 = reader.result;
      const b64clean = b64
        .replace('data:application/octet-stream;base64,', '')
        .replace('data:application/cbor;base64,', '')

      var buff = Buffer.from(b64clean, 'base64');
      resolve(buff);
    };
  });
}

class Channel {
  /**
   * @param {object} options
   * @param {URL} options.url
   * @param {Fetcher} options.fetch
   * @param {string} [options.method]
   */
  constructor({ url, fetch, method }) {
    this.fetch = fetch;
    this.method = method;
    this.url = url;
  }
  /**
   * @param {API.HTTPRequest} request
   * @returns {Promise<API.HTTPResponse>}
   */
  async request({ headers, body }) {
    const response = await this.fetch(this.url.href, {
      headers,
      body,
      method: this.method,
    });

    const buffer = response.ok
      ? await blobToBuffer(await response.blob())
      : HTTPError.throw('HTTP Request failed', response);

    return {
      headers: Object.fromEntries(response.headers.entries()),
      body: new Uint8Array(buffer),
    };
  }
}

/**
 * @typedef {{
 * status?: number
 * statusText?: string
 * url?: string
 * }} Options
 */
class HTTPError extends Error {
  /**
   * @param {string} message
   * @param {Options} options
   * @returns {never}
   */
  static throw(message, options) {
    throw new this(message, options);
  }
  /**
   * @param {string} message
   * @param {Options} options
   */
  constructor(message, { url, status = 500, statusText = 'Server error' }) {
    super(message);
    /** @type {'HTTPError'} */
    this.name = 'HTTPError';
    this.url = url;
    this.status = status;
    this.statusText = statusText;
  }
}
