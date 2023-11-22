import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

// Does component render without errors? 
test("renders without errors", () => {
  render(<ContactForm/>);
});

test("renders the contact form header", () => {
  // Arrange
  render(<ContactForm />);
  // extract elements you need, did query so it doesn't automatically stop before I get to assertions
  //made case insensative  
  const headerElement = screen.queryByText(/contact form/i);
  // console.log(headerElement);
  expect(headerElement).toBeInTheDocument();
  expect(headerElement).toBeTruthy();
  expect(headerElement).toHaveTextContent(/contact form/i);
});
test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  // used async await because state change
  //simulate user entering less than 5 characters into the first name field
  // want it to fail if cannot find element that is why used getByLabelText
  const firstNameField = screen.getByLabelText(/First Name*/i);
  // console.log(firstNameField)
  // this will trigger a state change
  userEvent.type(firstNameField, '123');
  //anytime you use an await you are awaiting something that returns a promise
  const errorMessages = await screen.findAllByTestId('error');
  expect(errorMessages).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  // got the button
  //state change here too 
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);

  await waitFor(() => {
   const errorMessages = screen.queryAllByTestId('error');
   expect(errorMessages).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameField = screen.getByLabelText(/first name*/i);
  userEvent.type(firstNameField, "warren");

  const lastNameField = screen.getByLabelText(/last name*/i);
  userEvent.type(lastNameField, "longmire");

  const button = screen.getByRole('button');
  userEvent.click(button);

  const errorMessages = await screen.findAllByTestId('error');
  expect(errorMessages).toHaveLength(1);
});
 
test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailField = screen.getByLabelText(/email*/i);
  userEvent.type(emailField, 'warren@gmail');
// anytime you do an await it should be find because that is what will return your promise
  const errorMessage = await screen.findByText(/email must be a valid email address/i);
  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm/>);
  const submitButton = screen.getByRole('button');
  userEvent.click(submitButton);

  const errorMessage = await screen.findByText(/lastName is a required field/i);
 expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstNameField = screen.getByLabelText(/first name*/i);
  const lastNameField = screen.getByLabelText(/last name*/i);
  const emailField = screen.getByLabelText(/email*/i);

  userEvent.type(firstNameField, "warren");
  userEvent.type(lastNameField, "longmire");
  userEvent.type(emailField, "longmire@email.com");

  const button = screen.getByRole('button');
  userEvent.click(button);

  await waitFor(()=> {
    const firstnameDisplay = screen.queryByText("warren");
    const lastnameDisplay = screen.queryByText('longmire');
    const emailDisplay = screen.queryByText('longmire@email.com');
    const messageDisplay = screen.queryByTestId('messageDisplay');

    expect(firstnameDisplay).toBeInTheDocument();
    expect(lastnameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
    render(<ContactForm />);

  const firstNameField = screen.getByLabelText(/first name*/i);
  const lastNameField = screen.getByLabelText(/last name*/i);
  const emailField = screen.getByLabelText(/email*/i);
  const messageField = screen.getByLabelText(/message/i);

  userEvent.type(firstNameField, "warren");
  userEvent.type(lastNameField, "longmire");
  userEvent.type(emailField, "longmire@email.com");
  userEvent.type(messageField, "warrenlongmiremessage");


  const button = screen.getByRole('button');
  userEvent.click(button);

  await waitFor(()=> {
    const firstnameDisplay = screen.queryByText("warren");
    const lastnameDisplay = screen.queryByText('longmire');
    const emailDisplay = screen.queryByText('longmire@email.com');
    const messageDisplay = screen.queryByText('warrenlongmiremessage');

    expect(firstnameDisplay).toBeInTheDocument();
    expect(lastnameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).toBeInTheDocument();
  });
});

