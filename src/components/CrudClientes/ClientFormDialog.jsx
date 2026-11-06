import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { clientSchema } from "../../validation/validationSchema";
import { createClient, updateClient } from "../../services/clientService";

import FormSection from "../ui/FormSection";

const ClientFormDialog = ({
  open,
  editing,
  selectedId,
  defaultValues,
  onClose,
  loadClients,
  showMessage,
}) => {

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: defaultValues || {},
  });

  const tipoCliente = watch("tipoCliente");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    if (!open) return;

    if (!editing) {
      reset({
        tipoCliente: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        razonSocial: "",
        identificadorNit: "",
        documento: "",
        tipoDocumento: "",
        email: "",
        telefono: "",
        direccion: "",
      });
    } else {
      reset(defaultValues || {});
    }

  }, [editing, defaultValues, reset, open]);

  const onSubmit = async (data) => {

    setIsSubmitting(true);

    try {

      if (editing) {
        await updateClient(selectedId, data);
        showMessage("Cliente actualizado con éxito", "success");
      } else {
        await createClient(data);
        showMessage("Cliente creado con éxito", "success");
      }

      reset({});
      onClose();
      loadClients();

    } catch (error) {

      const data = error.response?.data;

      if (data?.field) {

        setError(data.field, {
          type: "manual",
          message: data.message,
        });

      } else {

        showMessage(
          data?.message || "Error al guardar",
          "error"
        );

      }

    } finally {

      setIsSubmitting(false);

    }
  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >

      {/* HEADER */}

      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >

        <Box>

          <Typography variant="h6" fontWeight={700}>
            {editing ? "Editar Cliente" : "Registrar Cliente"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Completa la información del cliente
          </Typography>

        </Box>

        <Chip
          label={editing ? "Editando" : "Nuevo"}
          size="small"
          color={editing ? "warning" : "primary"}
          variant="outlined"
        />

      </DialogTitle>

      {/* CONTENT */}

      <DialogContent>

        <Box
          component="form"
          id="client-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >

          {/* INFORMACIÓN GENERAL */}

          <FormSection title="Información general">

            <TextField
              select
              label="Tipo de Cliente"
              fullWidth
              {...register("tipoCliente")}
              error={!!errors.tipoCliente}
              helperText={errors.tipoCliente?.message || " "}
            >
              <MenuItem value="PERSONA_NATURAL">
                Persona Natural
              </MenuItem>

              <MenuItem value="EMPRESA">
                Empresa
              </MenuItem>

            </TextField>

          </FormSection>

          {/* PERSONA NATURAL */}

          {tipoCliente === "PERSONA_NATURAL" && (

            <FormSection title="Datos personales">

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >

                <TextField
                  label="Primer Nombre"
                  fullWidth
                  {...register("primerNombre")}
                  error={!!errors.primerNombre}
                  helperText={errors.primerNombre?.message || " "}
                />

                <TextField
                  label="Segundo Nombre"
                  fullWidth
                  {...register("segundoNombre")}
                  error={!!errors.segundoNombre}
                  helperText={errors.segundoNombre?.message || " "}
                />

              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >

                <TextField
                  label="Primer Apellido"
                  fullWidth
                  {...register("primerApellido")}
                  error={!!errors.primerApellido}
                  helperText={errors.primerApellido?.message || " "}
                />

                <TextField
                  label="Segundo Apellido"
                  fullWidth
                  {...register("segundoApellido")}
                  error={!!errors.segundoApellido}
                  helperText={errors.segundoApellido?.message || " "}
                />

              </Box>

              <TextField
                select
                label="Tipo de Documento"
                fullWidth
                {...register("tipoDocumento")}
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento?.message || " "}
              >
                <MenuItem value="CEDULA_CIUDADANIA">
                  Cédula Ciudadanía
                </MenuItem>

                <MenuItem value="CEDULA_EXTRANJERIA">
                  Cédula Extranjería
                </MenuItem>

                <MenuItem value="TARJETA_EXTRANJERIA">
                  Tarjeta Extranjería
                </MenuItem>

                <MenuItem value="PASAPORTE">
                  Pasaporte
                </MenuItem>

                <MenuItem value="PEP">
                  Permiso Especial de Permanencia
                </MenuItem>

              </TextField>

            </FormSection>

          )}

          {/* EMPRESA */}

          {tipoCliente === "EMPRESA" && (

            <FormSection title="Información empresa">

              <TextField
                label="Razón Social"
                fullWidth
                {...register("razonSocial")}
                error={!!errors.razonSocial}
                helperText={errors.razonSocial?.message || " "}
              />

              <TextField
                label="Dígito verificador NIT"
                fullWidth
                {...register("identificadorNit")}
                error={!!errors.identificadorNit}
                helperText={errors.identificadorNit?.message || " "}
              />

              <TextField
                select
                label="Tipo de Documento"
                fullWidth
                {...register("tipoDocumento")}
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento?.message || " "}
              >
                <MenuItem value="NIT">
                  NIT
                </MenuItem>

              </TextField>

            </FormSection>

          )}

          {/* CONTACTO */}

          <FormSection title="Información de contacto">

            <TextField
              label="Documento"
              fullWidth
              disabled={editing}
              {...register("documento")}
              error={!!errors.documento}
              helperText={
                editing
                  ? "No se puede modificar"
                  : errors.documento?.message || " "
              }
            />

            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message || " "}
            />

            <TextField
              label="Teléfono"
              fullWidth
              {...register("telefono")}
              error={!!errors.telefono}
              helperText={errors.telefono?.message || " "}
            />

          </FormSection>

        </Box>

      </DialogContent>

      {/* ACTIONS */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #E2E8F0",
        }}
      >

        <Button
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          form="client-form"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting
              ? <CircularProgress size={16} color="inherit" />
              : null
          }
        >
          {isSubmitting
            ? (editing ? "Guardando..." : "Creando...")
            : (editing ? "Guardar cambios" : "Crear cliente")
          }
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default ClientFormDialog;