import { useState, forwardRef } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

/* Input validation */
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface IFormInput {
  _id: string;
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
  /* Allow other unkown values */
  [x: string]: unknown;
}

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

export default function EditMode(props: any) {
  const router = useRouter();
  /* Lifting State up to the main component */
  function handleEditMode(): void {
    props.setEditMode(!props.editMode);
  }

  const id: Readonly<string> = props.client._id;
  /* Insert to db */
  const defaultValues = {
    _id: id,
    address: props.client.address,
    city: props.client.city,
    company: props.client.company,
    cp: props.client.cp,
    email: props.client.email,
    firstname: props.client.firstname,
    lastname: props.client.lastname,
    phone: props.client.phone,
    tel: props.client.tel,
    info: props.client.info,
  };

  console.log("Info client");
  console.log(props.client);
  const formLabel = [
    { label: "Prénom", data: props.client.firstname, name: "firstname" },
    { label: "Nom", data: props.client.lastname, name: "lastname" },
    { label: "Adresse", data: props.client.address, name: "address" },
    { label: "Code Postal", data: props.client.cp, name: "cp" },
    { label: "Ville", data: props.client.city, name: "city" },
    { label: "Entreprise", data: props.client.company, name: "company" },
    { label: "Téléphone", data: props.client.tel, name: "tel" },
    { label: "Fixe", data: props.client.phone, name: "phone" },
    { label: "Email", data: props.client.email, name: "email" },
    {
      label: "Informations Complémentaires",
      data: props.client.info,
      name: "info",
    },
  ];

  /* Form validation */
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

  /* Display the snackbar with default value */
  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [formValues, setFormValues] = useState(defaultValues);
  // Snackbar state
  const [snackBarOpen, setSnackBarOpen] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = snackBarOpen;
  const [displayMessage, setDisplayMessage] = useState(
    "Une erreur est intervenue veuillez réessayer !"
  );

  const handleClose = () => {
    setSnackBarOpen({ ...snackBarOpen, open: false });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    props.setValidateButton(false);
  };

  async function clickHandler(): Promise<void> {
    // store form data
    const response = await fetch("/api/connectDB", {
      method: "PATCH",
      body: JSON.stringify(formValues),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);

    if (data.success === true) {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage("La modification a bien été validé");
      router.reload();
    } else {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage(data.message);
    }
  }

  console.log("editMode");
  console.log(props);

  return (
    <>
      <section className="mx-auto bg-slate-200 py-20 px-10">
        <Box
          onSubmit={handleSubmit(clickHandler)}
          component="form"
          className="flex flex-col gap-5"
        >
          {formLabel.map((info) => (
            <Controller
              key={info.name}
              name={info.name}
              control={control}
              render={() => (
                <TextField
                  id="outlined-basic"
                  label={info.label}
                  variant="outlined"
                  placeholder={info.label}
                  defaultValue={info.data}
                  {...register(info.name, {
                    onChange: handleInputChange,
                  })}
                />
              )}
              defaultValue={info.data}
            />
          ))}
          <Button
            variant="contained"
            className="bg-slate-800"
            onClick={handleEditMode}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            className="bg-slate-800"
            type="submit"
            disabled={props.validateButton}
          >
            Valider
          </Button>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {displayMessage}
          </Alert>
        </Snackbar>
      </section>
    </>
  );
}
