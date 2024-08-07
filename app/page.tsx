"use client"

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Grid, Paper, Autocomplete, TextField, Typography, FormControlLabel, Switch, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { createUser } from "@/controller/createUser";
import { Institution } from "@/models/interfaces";
import { createInstitution } from '@/controller/createInstitution';
import { fetchInstitutions } from "@/controller/fetchInstitutions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const baseData = {
  first_name: '',
  last_name: '',
  dni: '',
  email: '',
  phone: '',
  date_birth: '',
  belongsToInstitution: 'Yes',
  typeInstitution: '1',
  institution: 'default',
  //have_auth: false
}

const baseValidationForms = {
  first_name: false,
  last_name: false,
  dni: false,
  email: false,
  phone: false,
  date_birth: false,
  belongsToInstitution: false,
  typeInstitution: false,
  institution: false,
  //have_auth: false
}

const MySwal = withReactContent(Swal)

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState(baseData);
  const [inputValue, setInputValue] = useState('');
  const [validationForms, setValidationForm] = useState(baseValidationForms);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionData = await fetchInstitutions();
        setInstitutions(institutionData);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAutoCompleteInputChange = (event: React.ChangeEvent<{}>, value: string, reason: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (reason === 'input' && !institutions.some(institution => institution.name.toLowerCase() === value.toLowerCase())) {
        Swal.fire({
          title: 'Institución no encontrada',
          text: "¿Deseas agregar una nueva institución?",
          input: 'text',
          inputValue: value,
          inputPlaceholder: 'Nombre de la nueva institución',
          showCancelButton: true,
          confirmButtonText: 'Agregar',
          cancelButtonText: 'Cancelar',
          preConfirm: (newInstitutionName) => {
            if (!newInstitutionName) {
              Swal.showValidationMessage('El nombre de la institución no puede estar vacío');
            }
            return newInstitutionName;
          }
        }).then((result) => {
          if (result.isConfirmed) {
            handleAddNewInstitution(result.value);
          }
        });
      }
    }, 1500); //1.5 seg configura el tiempo que desees 
  };

  const handleAddNewInstitution = async (newInstitutionName: string) => {
    try {
      const newInstitution = await createInstitution({
        name: newInstitutionName,
        type: parseInt(formData.typeInstitution)
      });
      setInstitutions((prevInstitutions) => [...prevInstitutions, newInstitution]);
      setFormData((prevState) => ({
        ...prevState,
        institution: newInstitution._id
      }));
      Swal.fire('¡Éxito!', 'Institución agregada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo agregar la institución', 'error');
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    console.log(name, value)
    let isError = true;
    if (name == 'dni') {
      if (value.toString().length == 8) isError = false
    } else if (name == 'phone') {
      console.log("phonee")
      if (value.toString().length == 9) isError = false
    } else {
      if (e.target.validity.valid) isError = false
    }
    console.log(isError)
    setValidationForm((prevState) => ({
      ...prevState,
      [name]: isError
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAutoCompleteChange = (event: React.SyntheticEvent<Element, Event>, value: Institution | null) => {
    if (value && typeof value === 'string') {
      Swal.fire({
        title: 'Institución no encontrada',
        text: "¿Deseas agregar una nueva institución?",
        input: 'text',
        inputPlaceholder: 'Nombre de la nueva institución',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: (newInstitutionName) => {
          if (!newInstitutionName) {
            Swal.showValidationMessage('El nombre de la institución no puede estar vacío');
          }
          return newInstitutionName;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          handleAddNewInstitution(result.value);
        }
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        institution: value ? value._id : ''
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
      typeInstitution: checked ? '1' : prevState.typeInstitution
    }));
  };

  const alertError = (text: string) => {
    MySwal.fire({
      icon: "error",
      title: "Oops...",
      text,
      showConfirmButton: true,
      showLoaderOnConfirm: true
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.belongsToInstitution == "Yes") {
      if (formData.institution == 'default') {
        alertError('Tienes que seleccionar una institucion')
      } else {
        alertSuccess()
      }
    } else {
      alertSuccess()
    }
  };

  const alertSuccess = () => {
    let title = `<p>Desea crear un nuevo usuario y marcar su asistencia</p>`
    MySwal.fire({
      title,
      showConfirmButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async (updateUser) => {
        try {
          await createUser(formData);
          return true
        } catch (error) {
          MySwal.showValidationMessage(`
                Request failed: ${error}
            `);
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(baseData);
        return MySwal.fire(<p>Usuario creado satisfactoriamente</p>)
      }
    })
  }

  const setNameInstitution = (optionInstitution: any) => {
    let fullInstitution = optionInstitution.name;
    if (optionInstitution.address) {
      fullInstitution += fullInstitution + '-' + optionInstitution.address
    }
    return fullInstitution;
  }

  const calculateAge = () => {
    if (formData.date_birth) {
      const birthDate = new Date(formData.date_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    }
    return 20
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
              <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mb: 1 }} variant="h4">Registro del Participante</Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  required
                  error={validationForms.first_name}
                  helperText={validationForms.first_name ? "Por favor ingresa tu nombre" : ""}
                  type="text"
                  name="first_name"
                  margin="normal"
                  fullWidth
                  label="Nombres"
                  value={formData.first_name}
                  size={'small'}
                  onChange={handleInputChange}
                  sx={{ mt: 2, mb: 1.5 }}
                />
                <TextField
                  required
                  error={validationForms.last_name}
                  helperText={validationForms.last_name ? "Por favor ingresa tus apellidos" : ""}
                  type="text"
                  name="last_name"
                  margin="normal"
                  fullWidth
                  label="Apellidos"
                  value={formData.last_name}
                  size={'small'}
                  onChange={handleInputChange}
                  sx={{ mt: 1.5, mb: 1.5 }}
                />
                <TextField
                  required
                  error={validationForms.dni}
                  helperText={validationForms.dni ? "Deben ser 8 digitos" : ""}
                  type="number"
                  name="dni"
                  margin="normal"
                  fullWidth
                  label="Nº DNI"
                  size={'small'}
                  value={formData.dni}
                  onChange={handleInputChange}
                  sx={{ mt: 1.5, mb: 1.5 }}
                />
                <TextField
                  required
                  error={validationForms.phone}
                  helperText={validationForms.phone ? "Deben ser 9 digitos" : ""}
                  type="number"
                  name="phone"
                  margin="normal"
                  fullWidth
                  label="Nº de Celular (WhatsApp)"
                  value={formData.phone}
                  size={'small'}
                  onChange={handleInputChange}
                  sx={{ mt: 1.5, mb: 1.5 }}
                />
                {/*
              <TextField
                type="email"
                name="email"
                margin="normal"
                fullWidth
                label="Correo electronico"
                value={formData.email}
                size={'small'}
                onChange={handleInputChange}
                sx={{ mt: 1.5, mb: 1.5 }}
              />
            */}
                <TextField
                  required
                  error={validationForms.date_birth}
                  helperText={validationForms.date_birth ? "Por favor ingresa su fecha de nacimiento" : ""}
                  type="date"
                  name="date_birth"
                  margin="normal"
                  fullWidth
                  label="Fecha de nacimiento"
                  value={formData.date_birth}
                  size={'small'}
                  onChange={handleInputChange}
                  sx={{ mt: 1.5, mb: 1.5 }}
                  InputLabelProps={{ shrink: true }}
                />
                <>
                  <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mt: 1, mb: 1 }} variant="h5">¿Perteneces a alguna institución?</Typography>
                  <Select
                    size='small'
                    name="belongsToInstitution"
                    value={formData.belongsToInstitution}
                    onChange={handleSelectChange}
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                  >
                    <MenuItem value="Yes">Sí</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </>
                {(formData.belongsToInstitution === "Yes") && (
                  <>
                    <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mt: 1, mb: 1 }} variant="h5">A qué tipo de institución perteneces:</Typography>
                    <Select
                      size='small'
                      name="typeInstitution"
                      value={formData.typeInstitution}
                      onChange={handleSelectChange}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    >
                      <MenuItem value="1">Parroquia</MenuItem>
                      <MenuItem value="2">Colegio</MenuItem>
                      <MenuItem value="3">Universidad</MenuItem>
                      <MenuItem value="4">Congregación</MenuItem>
                    </Select>
                  </>
                )}
                {formData.belongsToInstitution === "Yes" && (
                  <>
                    <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mt: 1, mb: 1 }} variant="h5">
                      Indica la institución a la que perteneces:
                    </Typography>
                    <Autocomplete
                      size='small'
                      options={institutions.filter(institution => institution.type === parseInt(formData.typeInstitution))}
                      getOptionLabel={(option) => option.name}
                      onChange={handleAutoCompleteChange}
                      onInputChange={handleAutoCompleteInputChange}
                      renderInput={(params) => <TextField {...params} label="Selecciona una institución" fullWidth />}
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </>
                )}
                { /*calculateAge() < 18 && (
              <>
                <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mt: 1, mb: 1 }} variant="h5">¿Tienes autorización?</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="have_auth"
                      checked={formData.have_auth}
                      onChange={(e) => setFormData((prevState) => ({
                        ...prevState,
                        have_auth: e.target.checked
                      }))}
                      color="primary"
                    />
                  }
                  label={formData.have_auth ? "Sí" : "No"}
                  sx={{ mt: 2, mb: 2 }}
                />
              </>
            )*/}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrar
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
