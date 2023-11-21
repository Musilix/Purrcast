import { Form, Formik, useField } from 'formik';
import { AlertCircle } from "lucide-react";
import * as Yup from 'yup';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type customProps = {
  label: string;
  id?: string;
  name: string;
  type: string;
  placeholder: string;
}

const FormInput = ({ label, ...props }: customProps) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <>
      <div className="flex flex-col space-y-1.5" >
        <Label htmlFor={props.id || props.name}>{label}</Label>
        <Input {...field} {...props} />

        {meta.touched && meta.error ? (
          // TODO: make this a component
          <div className="error">

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wait up...</AlertTitle>
              <AlertDescription>
                {meta.error}
              </AlertDescription>
            </Alert>

          </div>
        ) : null}
      </div>
    </>
  );
};

// And now we can use these
const SignupForm = () => {
  return (
    <>
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Start Purring</CardTitle>
          <CardDescription>Sign up now to start using Purrcast!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Formik
            // innerRef={formRef}
            initialValues={{
              firstName: '',
              lastName: '',
              username: ''
            }}

            validationSchema={Yup.object({
              firstName: Yup.string()
                .max(25, 'Your first name must be 25 characters or less')
                .required('You need to enter a first name'),
              lastName: Yup.string()
                .max(25, 'Your last name must be 25 characters or less')
                .required('You need to enter a last name'),
              username: Yup.string()
                .min(5, 'Your username must be 5 characters or more')
                .max(15, 'Your username must be 15 characters or less')
                .required('You need to enter a username'),
            })}

            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));

                setSubmitting(false);
              }, 400);


              // TODO
              // call service to create user

              // await prisma client promise

              // setsubmitting to false after promise resolves
            }}
          >
            <Form id="sign-up-form" >
              <div className="grid w-full items-center gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Jimbo"
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Jones"
                />

                <FormInput
                  label="User Name"
                  name="username"
                  type="username"
                  placeholder="Get creative!"
                />
              </div>
            </Form>
          </Formik>
        </CardContent >
        <CardFooter className="flex justify-center">
          <Button type="submit" form="sign-up-form" variant="outline">Sign Up</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SignupForm;