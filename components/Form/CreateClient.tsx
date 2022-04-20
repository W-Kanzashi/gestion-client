import { useState, forwardRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

/* Input validation */
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Generate fake data
import { randUser, randParagraph, randBrand, randNumber } from "@ngneat/falso";

// Snackbar state
export interface State extends SnackbarOrigin {
  open: boolean;
}

// Type to check the form data
interface IFormInput {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  company: string;
  cp: string;
  email: string;
  phone: string;
  tel: string;
  info: string;
}

// Yup schema form validation
const schema = yup
  .object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    address: yup.string(),
    city: yup.string(),
    company: yup.string(),
    cp: yup.string(),
    email: yup.string().email(),
    phone: yup.string(),
    tel: yup.string(),
    info: yup.string(),
  })
  .required();

/**
 * Display and manage the form
 * @returns JSX.Element
 */
export default function CreateClient() {
  // User random data
  const user = randUser();
  const phone = randNumber({ min: 1000000000, max: 9999999999, length: 2 });

  // Form default values
  const defaultValues = {
    address: user.address.street,
    city: user.address.city,
    company: randBrand(),
    cp: user.address.zipCode,
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    phone: phone[0].toString(),
    tel: phone[1].toString(),
    info: randParagraph(),
  };
  /* Display the snackbar with default value */
  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  /* Save and validate the form values */
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // Form values state
  const [formValues, setFormValues] = useState(defaultValues);
  // Snackbar state
  const [snackBarOpen, setSnackBarOpen] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = snackBarOpen;
  // Snackbar message if there is an error
  const [displayMessage, setDisplayMessage] = useState(
    "Une erreur est intervenue veuillez réessayer !"
  );

  // Handle the snackbar display
  const handleSnackbarClose = () => {
    setSnackBarOpen({ ...snackBarOpen, open: false });
  };

  // Handle the form input
  const handleInputChange = (e: any) => {
    // Get the value of the input text
    const { name, value } = e.target;
    // Update the default values of the form
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Send the form data to the database
  async function clickHandler(inputValue: IFormInput): Promise<void> {
    // store form data
    const response = await fetch("/api/connectDB", {
      method: "POST",
      body: JSON.stringify(inputValue),
      headers: { "Content-type": "application/json" },
    });
    // Wait for the response
    const data = await response.json();

    // Display the snackbar
    if (data.message === "201") {
      setDisplayMessage("Le client a bien été ajouté");
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
    } else {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
    }
  }

  return (
    <>
      {/* Form start */}
      <Box
        onSubmit={handleSubmit(clickHandler)}
        component="form"
        className="mb-20 flex flex-col gap-10"
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {/* Controller is needed to render MUI without errors */}
          <Controller
            name="firstname"
            control={control}
            render={() => (
              // Display the input text with the default value
              <TextField
                label={errors.firstname ? "Un prénom est requis" : "Prénom"}
                id="firstname"
                placeholder="Prénom"
                color={errors.firstname ? "error" : "primary"}
                value={formValues.firstname}
                {...register("firstname", {
                  required: true,
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.firstname}
          />
          <Controller
            name="lastname"
            control={control}
            render={() => (
              <TextField
                label={errors.lastname ? "Un nom est requis" : "Nom"}
                id="firstname"
                placeholder="Nom"
                color={errors.lastname ? "error" : "primary"}
                value={formValues.lastname}
                {...register("lastname", {
                  required: true,
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.lastname}
          />
          <Controller
            name="company"
            control={control}
            render={() => (
              <TextField
                label="Entreprise"
                id="company"
                placeholder="Entreprise"
                color={errors.company ? "error" : "primary"}
                value={formValues.company}
                {...register("company", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.company}
          />
          <Controller
            name="address"
            control={control}
            render={() => (
              <TextField
                label="Adresse"
                id="address"
                placeholder="Adresse"
                color={errors.address ? "warning" : "primary"}
                value={formValues.address}
                {...register("address", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.address}
          />
          <Controller
            name="cp"
            control={control}
            render={() => (
              <TextField
                label="Code Postal"
                id="cp"
                placeholder="Code postal"
                color={errors.cp ? "warning" : "primary"}
                value={formValues.cp}
                {...register("cp", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.cp}
          />
          <Controller
            name="city"
            control={control}
            render={() => (
              <TextField
                label="Ville"
                id="city"
                placeholder="Ville"
                color={errors.city ? "warning" : "primary"}
                value={formValues.city}
                {...register("city", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.city}
          />
          <Controller
            name="phone"
            control={control}
            render={() => (
              <TextField
                label="Téléphone"
                id="phone"
                placeholder="00 00 00 00 00"
                color={errors.phone ? "warning" : "primary"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+33</InputAdornment>
                  ),
                }}
                value={formValues.phone}
                {...register("phone", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.phone}
          />
          <Controller
            name="tel"
            control={control}
            render={() => (
              <TextField
                label="Portable"
                id="tel"
                placeholder="00 00 00 00 00"
                color={errors.tel ? "warning" : "primary"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+33</InputAdornment>
                  ),
                }}
                value={formValues.tel}
                {...register("tel", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.tel}
          />
          <Controller
            name="email"
            control={control}
            render={() => (
              <TextField
                label={errors.email ? "L'email est incorrecte" : "Email"}
                id="email"
                placeholder="Email"
                color={errors.email ? "warning" : "primary"}
                value={formValues.email}
                {...register("email", {
                  onChange: handleInputChange,
                })}
              />
            )}
            defaultValue={formValues.phone}
          />
        </div>
        <Controller
          name="info"
          control={control}
          render={() => (
            <TextField
              label="Informations complémentaires"
              id="info"
              placeholder="Informations complémentaires"
              color={errors.info ? "warning" : "primary"}
              multiline={true}
              fullWidth={true}
              value={formValues.info}
              {...register("info", {
                onChange: handleInputChange,
              })}
            />
          )}
          defaultValue={formValues.info}
        />
        <Button variant="contained" type="submit" className="bg-slate-800">
          Créer le Client
        </Button>
        {/* Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {displayMessage}
          </Alert>
        </Snackbar>
      </Box>
      {/* Form end */}
    </>
  );
}
