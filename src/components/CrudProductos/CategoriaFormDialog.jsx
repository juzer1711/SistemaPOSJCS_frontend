import React, { useEffect} from "react";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  Button, 
  Box
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriaSchema } from "../../validation/validationSchema"; 
import { createCategoria, updateCategoria } from "../../services/productService";

const CategoriaFormDialog = ({ 
  open, 
  editing, 
  selectedId,   
  defaultValues, 
  onClose,
  loadProducts, 
  loadCategorias,
  showMessage }) => {
  const { 
    register, 
    handleSubmit,
    reset, formState: { errors } } = useForm({
    resolver: yupResolver(categoriaSchema),
    defaultValues: defaultValues || {},
  });

useEffect(() => {
  if (!open) return
  if (!editing) {
    reset({
      nombre: "",
    });
  }else {reset(defaultValues);}
}, [defaultValues, editing, reset, open]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateCategoria(selectedId, data);
        showMessage("Categoria actualizada con éxito", "success");
      } else {
        await createCategoria(data);
        showMessage("Categoria creado con éxito", "success");
      }
      reset({});
      onClose();
      loadProducts();
      loadCategorias();

    } catch (error) {
  showMessage(error.message, "error");
  }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? "Editar Categoria" : "Registrar nueva categoria"}
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="categoria-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nombre de la categoria"
            {...register("nombre")}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          form="categoria-form"
          variant="contained"
        >
          {editing ? "Guardar" : "Crear"}
        </Button>
      </DialogActions>      
    </Dialog>
  );
};

export default CategoriaFormDialog;
