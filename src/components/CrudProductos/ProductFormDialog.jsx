import React, { useEffect, useState } from "react";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  Button, 
  Box,
  Autocomplete ,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../validation/validationSchema"; 
import { createProduct, updateProduct } from "../../services/productService";
import FormSection from "../ui/FormSection";
import { dialogStyles } from "../../styles/dialogStyles";

const ProductFormDialog = ({ 
  open, 
  editing, 
  selectedId, 
  defaultValues, 
  onClose, 
  loadProducts,
  categorias, 
  showMessage }) => {
const { 
  register, 
  handleSubmit,
  control, 
  reset,
  setError,
  formState: { errors } 
} = useForm({
  resolver: yupResolver(productSchema),
  defaultValues: defaultValues || {},
});

const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  if (!open) return
  if (!editing) {
    reset({
      nombre: "",
      categoriaId: "",
      codigoBarras: "",
      descripcion: "",
      costo: "",
      precioventa: "",
      iva: "",
    });
  }else if (defaultValues) {
      reset({
        ...defaultValues,
      categoriaId: Number(defaultValues.categoria?.id || ""),
  });
    }
}, [defaultValues, editing, reset, open]);



const onSubmit = async (data) => {
  setIsSubmitting(true);

    try {
      if (!data.categoriaId) {
        showMessage("Debe seleccionar una categoría", "warning");
        return;
      }
      data.categoria = { id: data.categoriaId };
      delete data.categoriaId;

      if (editing) {
        await updateProduct(selectedId, data);
        showMessage("Producto actualizado con éxito", "success");
      } else {
        await createProduct(data);
        showMessage("Producto creado con éxito", "success");
      }
      reset({});
      onClose();
      loadProducts();

    } catch (error) {
      const data = error.response?.data;

      console.log(" DATA:", data);

      if (data?.field) {
        setError(data.field, {
          type: "manual",
          message: data.message
        });
      } else {
        showMessage(data?.message || "Error al guardar", "error");
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
      sx={dialogStyles.dialog}
    >
      <DialogTitle component="div" sx={dialogStyles.dialogHeader}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {editing ? "Editar Producto" : "Registrar Producto"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Completa la información del producto
          </Typography>
        </Box>

        <Chip
          label={editing ? "Editando" : "Nuevo"}
          size="small"
          color={editing ? "warning" : "primary"}
          variant="outlined"
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 0 }}>
        <Box
          component="form"
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormSection title="Información general">

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >

              <TextField
                label="Nombre del producto"
                {...register("nombre")}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                fullWidth
              />

              <Controller
                name="categoriaId"
                control={control}
                rules={{ required: "La categoría es obligatoria" }}
                render={({ field }) => (
                  <Autocomplete
                    options={categorias}
                    getOptionLabel={(option) => option.nombre}
                    isOptionEqualToValue={(option, value) =>
                      option.idCategoria === value.idCategoria
                    }
                    value={
                      categorias.find(
                        (c) => Number(c.idCategoria) === Number(field.value)
                      ) || null
                    }
                    onChange={(e, newValue) => {
                      field.onChange(
                        newValue ? Number(newValue.idCategoria) : null
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoría"
                        error={!!errors.categoriaId}
                        helperText={errors.categoriaId?.message}
                      />
                    )}
                  />
                )}
              />

            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
                mt: 2,
              }}
            >

              <TextField
                label="Código de barras"
                {...register("codigoBarras")}
                disabled={editing}
                error={!!errors.codigoBarras}
                helperText={errors.codigoBarras?.message}
                fullWidth
              />

              <TextField
                label="Descripción"
                {...register("descripcion")}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                fullWidth
              />

            </Box>

          </FormSection>

          <FormSection title="Precios e impuestos">

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >

              <TextField
                label="Costo"
                {...register("costo")}
                error={!!errors.costo}
                helperText={errors.costo?.message}
                fullWidth
              />

              <TextField
                label="Precio de venta"
                {...register("precioventa")}
                error={!!errors.precioventa}
                helperText={errors.precioventa?.message}
                fullWidth
              />

              <TextField
                select
                label="IVA"
                {...register("iva")}
                error={!!errors.iva}
                helperText={errors.iva?.message}
                fullWidth
              >
                <MenuItem value="IVA_0">0%</MenuItem>
                <MenuItem value="IVA_5">5%</MenuItem>
                <MenuItem value="IVA_19">19%</MenuItem>
              </TextField>

            </Box>

          </FormSection>


            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
              >
                {editing ? "Guardar" : "Crear"}
              </Button>
            </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
