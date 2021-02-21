import {
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Field, FieldArray, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { object, number, string, boolean, array, ValidationError } from 'yup';

const emptyDonation = { institution: '', percentage: 0 };

const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  stretch: {
    flexGrow: 1,
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
            donations: [emptyDonation],
          }}
          validationSchema={object({
            fullName: string().required('You need to provide a name'),
            donationsAmount: number()
              .required('You need a donation amount')
              .min(10),
            termsAndConditions: boolean()
              .required('You cannot proceed if you do not agree')
              .isTrue(),
            donations: array(
              object({
                institution: string()
                  .required('Institution is required')
                  .min(3, 'Insitution needs to be at least 3 characters'),
                percentage: number()
                  .required('Percentage is required')
                  .min(1, 'Percentage needs to be at least 1')
                  .max(100, 'Percentage cannot be greater than 100'),
              })
            )
              .min(1)
              .max(3)
              .test((donations: Array<{ percentage: number }>) => {
                const sum = donations.reduce(
                  (acc, curr) => acc + curr.percentage,
                  0
                );
                if (sum !== 100) {
                  return new ValidationError(
                    `Percentage is currently ${sum}, it should add up to 100%`,
                    undefined,
                    'donations'
                  );
                }
                return true;
              }),
          })}
          onSubmit={async (values) => {
            console.log(`my values = ${values}`);
            return new Promise((res) => setTimeout(res, 2500));
          }}>
          {({ values, errors, isSubmitting, isValid }) => (
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

                <FieldArray name='donations'>
                  {({ push, remove }) => (
                    <>
                      <Grid item>
                        <Typography variant='body2'>
                          All your donations
                        </Typography>
                      </Grid>
                      {values.donations.map((_, index) => (
                        <Grid container item key={index} spacing={2}>
                          <Grid
                            item
                            xs={12}
                            sm='auto'
                            className={classes.stretch}>
                            <Field
                              fullWidth
                              name={`donations[${index}].institution`}
                              component={TextField}
                              label='institution'
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm='auto'
                            className={classes.stretch}>
                            <Field
                              fullWidth
                              name={`donations[${index}].percentage`}
                              component={TextField}
                              label='percentage'
                              type='number'
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm='auto'
                            className={classes.stretch}>
                            <Button
                              disabled={isSubmitting}
                              onClick={() => remove(index)}>
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item>
                        {typeof errors.donations === 'string' ? (
                          <Typography color='error'>
                            {errors.donations}
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant='contained'
                          onClick={() => push(emptyDonation)}>
                          Add Donation
                        </Button>
                      </Grid>
                    </>
                  )}
                </FieldArray>

                <Grid item>
                  <Field
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
                    disabled={isSubmitting || !isValid}
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
