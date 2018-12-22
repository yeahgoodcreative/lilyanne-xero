/** @internalapi */
/** This second comment is required for typedoc to recognise the WHOLE FILE as @internalapi */
import { ApiConfiguration, XeroClientConfiguration } from './BaseAPIClient';
import { AccessToken, OAuth1Configuration } from './OAuth1HttpClient';
/** @private */
export declare function mapState(xeroConfig: XeroClientConfiguration): AccessToken;
/** @private */
export declare function mapConfig(xeroConfig: XeroClientConfiguration, apiConfig: ApiConfiguration): OAuth1Configuration;
