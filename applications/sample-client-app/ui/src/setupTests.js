import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Globally Configure the Enzyme adapter for testing react code
configure({ adapter: new Adapter() });
