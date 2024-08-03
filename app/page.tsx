"use client"

import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, Autocomplete, TextField, Typography, FormControlLabel, Switch, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { createUser } from "@/controller/createUser";
import { Institution } from "@/models/interfaces";
import { fetchInstitutions } from "@/controller/fetchInstitutions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const baseData = {
  first_name: '',
  last_name: '',
  dni: '',
  email:'',
  phone: '',
  date_birth: '',
  belongsToInstitution: 'Yes',
  typeInstitution: '1',
  institution: 'default',
  area: 'default',
  have_auth: 'No'
}

const MySwal = withReactContent(Swal)

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState(baseData);

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
  };

  const handleSelectChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAutoCompleteChange = (event: React.SyntheticEvent, value: Institution | null) => {
    setFormData((prevState) => ({
      ...prevState,
      institution: value ? value._id : ''
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
      typeInstitution: checked ? '1' : prevState.typeInstitution
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let  title = `<p>Desea crear un nuevo usuario y marcar su asistencia</p>`
    MySwal.fire({
      title,
      showConfirmButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async (updateUser) => {
          try {
            await createUser(formData);
            return true
          } catch(error) {
            MySwal.showValidationMessage(`
                Request failed: ${error}
            `);
          }
      }
    }).then((result) => {
        if (result.isConfirmed) {
          setFormData(baseData)
          return MySwal.fire(<p>Usuario creado satisfactoriamente</p>)
        }
    })
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
                type="text"
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
                type="text"
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
                    getOptionLabel={(option) => {return `${option.name} - ${option.address}`}}
                    onChange={handleAutoCompleteChange}
                    renderInput={(params) => <TextField {...params} label="Selecciona una institución" fullWidth />}
                    sx={{ mt: 1, mb: 2 }}
                  />
                </>
              )}
              {formData.typeInstitution === "2" && (
              <>
                <Typography className="text-center font-bold !text-base md:!text-lg xl:!text-2xl" sx={{ mt: 1, mb: 1 }} variant="h5">¿Tienes autorización?</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="have_auth"
                      checked={formData.have_auth === 'Yes'}
                      onChange={(e) => setFormData((prevState) => ({
                        ...prevState,
                        have_auth: e.target.checked ? 'Yes' : 'No'
                      }))}
                      color="primary"
                    />
                  }
                  label={formData.have_auth === 'Yes' ? "Sí" : "No"}
                  sx={{ mt: 2, mb: 2 }}
                />
              </>
            )}
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
