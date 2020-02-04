import { config } from '../../src/server/config';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());

configure({ adapter: new Adapter() });

const { window } = new JSDOM('', { url: config.url });

Object.assign(global, { window, document: window.document, navigator: { userAgent: 'node.js' } });
