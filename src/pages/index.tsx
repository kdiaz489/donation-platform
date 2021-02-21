import {
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { object, number, string, boolean } from 'yup';

const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main,
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{
            fullName: '',
            donationsAmount: 0,
            termsAndConditions: false,
          }}
          validationSchema={object({
            fullName: string().required('You need to provide a name'),
            donationsAmount: number()
              .required('You need a donation amount')
              .min(10),
            termsAndConditions: boolean()
              .required('You cannot proceed if you do not agree')
              .isTrue(),
          })}
          onSubmit={async (values) => {
            console.log(`my values = ${values}`);
            return new Promise((res) => setTimeout(res, 2500));
          }}>
          {({ values, errors, isSubmitting }) => (
            <Form autoComplete='off'>
              <Grid container direction='column' spacing={2}>
                <Grid item>
                  <Field
                    fullWidth
                    name='fullName'
                    component={TextField}
                    label='Full Name'
                  />
                </Grid>
                <Grid item>
                  <Field
                    fullWidth
                    name='donationsAmount'
                    type='number'
                    component={TextField}
                    label='Donation'
                  />
                </Grid>
                <Grid item>
                  <Field
                    fullWidth
                    name='termsAndConditions'
                    type='checkbox'
                    component={CheckboxWithLabel}
                    Label={{
                      label: 'I accept the terms and conditions.',
                      className: errors.termsAndConditions
                        ? classes.errorColor
                        : undefined,
                    }}
                  />
                </Grid>

                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    variant='contained'
                    color='primary'
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size='1rem' />
                      ) : undefined
                    }>
                    {isSubmitting ? 'Submitting' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
