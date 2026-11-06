import {
  AccountBalanceWalletOutlined,
  AssessmentOutlined,
  BusinessOutlined,
  HistoryOutlined,
  HomeOutlined,
  Inventory2Outlined,
  PeopleAltOutlined,
  PersonOutlineRounded,
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  WarehouseOutlined,
  ViewModuleOutlined,
  SecurityOutlined,
} from "@mui/icons-material";

export const NAV_SECTIONS = [
  {
    label: "Inicio",
    icon: HomeOutlined,
    items: [
      {
        label: "Panel principal",
        path: "/admin-dashboard",
        icon: HomeOutlined,
      },
    ],
  },
  {
    label: "Ventas",
    icon: PointOfSaleOutlined,
    items: [
      {
        label: "Nueva venta",
        description: "Registra una venta desde el punto de atención.",
        path: "/nueva-venta",
        icon: PointOfSaleOutlined,
        tone: "green",
      },
      {
        label: "Historial de ventas",
        description: "Consulta las transacciones y su información.",
        path: "/mostrar-ventas",
        icon: ReceiptLongOutlined,
        tone: "blue",
      },
    ],
  },
  {
    label: "Parámetros",
    icon: BusinessOutlined,
    items: [
      {
        label: "Usuarios",
        description: "Administra cuentas y accesos del equipo.",
        path: "/gestion-usuarios",
        modulo: "USUARIOS",
        icon: PeopleAltOutlined,
        tone: "blue",
      },
      {
        label: "Módulos",
        description: "Administra las áreas funcionales y sus datos base.",
        path: "/gestion-modulos",
        modulo: "MODULOS",
        icon: ViewModuleOutlined,
        tone: "teal",
      },
      {
        label: "Clientes",
        description: "Mantén al día la información de tus clientes.",
        path: "/gestion-clientes",
        icon: PersonOutlineRounded,
        tone: "violet",
      },
      {
        label: "Productos",
        description: "Organiza el catálogo, los precios y los productos.",
        path: "/gestion-productos",
        icon: Inventory2Outlined,
        tone: "orange",
      },
      {
        label: "Inventario",
        description: "Controla existencias y movimientos.",
        path: "/inventario",
        icon: WarehouseOutlined,
        tone: "teal",
      },
      {
        label: "Empresa",
        description: "Actualiza la información general del negocio.",
        path: "/empresa",
        icon: BusinessOutlined,
        tone: "blue",
      },
    ],
  },
  {
    label: "Seguridad",
    icon: SecurityOutlined,
    items: [{
      label: "Reglas y permisos",
      description: "Administra los permisos de cada usuario por módulo.",
      path: "/gestion-reglas",
      modulo: "REGLAS",
      icon: SecurityOutlined,
      tone: "violet",
    }],
  },
  {
    label: "Cajas",
    icon: AccountBalanceWalletOutlined,
    items: [
      {
        label: "Gestión de cajas",
        description: "Administra la apertura y el cierre de cajas.",
        path: "/gestion-cajas",
        icon: AccountBalanceWalletOutlined,
        tone: "amber",
      },
    ],
  },
  {
    label: "Análisis",
    icon: AssessmentOutlined,
    items: [
      {
        label: "Reportes",
        description: "Revisa indicadores e información del negocio.",
        path: "/reportes",
        icon: AssessmentOutlined,
        tone: "violet",
      },
      {
        label: "Auditoría",
        description: "Consulta la trazabilidad de las acciones.",
        path: "/auditoria",
        icon: HistoryOutlined,
        tone: "teal",
      },
    ],
  },
];
