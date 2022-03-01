import Parse from 'parse/dist/parse.min.js';
import { serverKeys } from '../keys';


const PARSE_APPLICATION_ID = serverKeys.PARSE_APPLICATION_ID;
const PARSE_HOST_URL = serverKeys.PARSE_HOST_URL;
const PARSE_JAVASCRIPT_KEY = serverKeys.PARSE_JAVASCRIPT_KEY;
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

export default Parse;
