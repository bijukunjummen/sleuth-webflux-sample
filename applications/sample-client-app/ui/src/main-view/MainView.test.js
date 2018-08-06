import React from 'react';
import { shallow, mount } from 'enzyme';
import {MainForm} from './MainView';
import sinon from 'sinon'

describe("Main View of Client UI", () => {

  it('renders main view with Payload and Delay Form', () => {
    const wrapper = shallow(<MainForm />);
    expect(wrapper.contains(<h3>Send a request</h3>)).toEqual(true);
    expect(wrapper.find("label[htmlFor='payload']").html()).toMatch(/Payload/)
    expect(wrapper.find("label[htmlFor='delay']").html()).toMatch(/Delay/)
  });

  it("handles form submissions", () => {
    const wrapper = mount(<MainForm />);
    wrapper.setState({payload: "Sample", delay: 100})
    const passthroughCallSpy = jest.spyOn(
      wrapper.instance(),
      'passthroughCallAndSetState'
    ).mockImplementation((payload, delay) => {
    });
    expect(wrapper.find("button[name='submit']").html()).toMatch(/Submit/)

    wrapper.find("button[name='submit']").simulate("submit");
    expect(passthroughCallSpy).toHaveBeenCalledWith("Sample", 100);
    expect(wrapper.state("loading")).toBe(false)
  });

  it("handles form validations", () => {
    const wrapper = mount(<MainForm />);
    wrapper.find("textarea[name='payload']").simulate('change', {target: {name: 'payload', value: 'S'}});
    expect(wrapper.state("payloadValid")).toBe(false)
  });
});

