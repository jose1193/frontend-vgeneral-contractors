// app/constants/navigation.tsx
import {
  House as HouseIcon,
  AccountCircle,
  Contacts as ContactsIcon,
  PostAdd as PostAddIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  BorderColor as BorderColorIcon,
  GpsFixed as GpsFixedIcon,
  MonetizationOn as MonetizationOnIcon,
  ContentPasteSearch as ContentPasteSearchIcon,
  ViewKanban as ViewKanbanIcon,
  CalendarMonth as CalendarMonthIcon,
  Inbox as InboxIcon,
  Domain as DomainIcon,
  Api as ApiIcon,
  DocumentScanner as DocumentScannerIcon,
  Settings as SettingsIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Assignment as AssignmentIcon,
  FactCheckOutlined,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Handshake as HandshakeIcon,
  AccountBalance as AccountBalanceIcon,
  SmartToy as SmartToyIcon,
  CameraAlt as CameraAltIcon,
  ContentPaste as ContentPasteIcon,
  ReceiptLong as ReceiptLongIcon,
  PeopleAlt as PeopleAltIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  GridView as GridViewIcon,
  ErrorOutline as ErrorOutlineIcon,
  DriveFileRenameOutline as DriveFileRenameOutlineIcon,
  AssignmentInd as AssignmentIndIcon,
} from "@mui/icons-material";
import { PageItem } from "../types/navigation";
import { ROUTES } from "./routes";
import { PERMISSIONS } from "@/config/permissions";

export const PAGES: PageItem[] = [
  {
    name: "Home",
    href: ROUTES.DASHBOARD.HOME,
    icon: HouseIcon,
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    name: "Profile",
    href: ROUTES.DASHBOARD.PROFILE,
    icon: AccountCircle,
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    name: "Customers",
    href: ROUTES.DASHBOARD.CUSTOMERS,
    icon: ContactsIcon,
    permission: PERMISSIONS.MANAGE_CUSTOMERS,
  },
  {
    name: "Claims",
    icon: PostAddIcon,
    permission: PERMISSIONS.MANAGE_CLAIMS,
    subItems: [
      {
        name: "New Claim",
        href: ROUTES.DASHBOARD.CLAIMS.CREATE,
        icon: AddCircleOutlineIcon,
      },
      {
        name: "List",
        href: ROUTES.DASHBOARD.CLAIMS.LIST,
        icon: AssignmentIcon,
      },
    ],
  },
  {
    name: "DocuSign",
    icon: AssignmentTurnedInIcon,
    permission: PERMISSIONS.MANAGE_CONFIG,
    subItems: [
      {
        name: "New Connection",
        href: ROUTES.DASHBOARD.DOCUSIGN.CONNECT,
        icon: AddCircleOutlineIcon,
      },
      {
        name: "Documents List",
        href: ROUTES.DASHBOARD.DOCUSIGN.DOCUMENTS,
        icon: AssignmentIcon,
      },
      {
        name: "Status Monitor",
        href: ROUTES.DASHBOARD.DOCUSIGN.STATUS,
        icon: FactCheckOutlined,
      },
    ],
  },
  {
    name: "Sign. SalesPerson",
    href: ROUTES.DASHBOARD.SIGNATURES.SALESPERSON,
    icon: BorderColorIcon,
    permission: PERMISSIONS.MANAGE_SIGNATURES,
  },
  {
    name: "Prospects",
    href: ROUTES.DASHBOARD.PROSPECTS,
    icon: GpsFixedIcon,
  },
  {
    name: "Deals",
    href: ROUTES.DASHBOARD.DEALS,
    icon: MonetizationOnIcon,
  },
  {
    name: "Projects",
    href: ROUTES.DASHBOARD.PROJECTS,
    icon: ContentPasteSearchIcon,
  },
  {
    name: "Stages",
    href: ROUTES.DASHBOARD.STAGES,
    icon: ViewKanbanIcon,
  },
  {
    name: "Calendars",
    href: ROUTES.DASHBOARD.CALENDARS,
    icon: CalendarMonthIcon,
  },
  {
    name: "Emails",
    href: ROUTES.DASHBOARD.EMAILS,
    icon: InboxIcon,
  },
  {
    name: "Companies",
    icon: DomainIcon,
    permission: PERMISSIONS.MANAGE_COMPANIES,
    subItems: [
      {
        name: "Insurance",
        href: ROUTES.DASHBOARD.COMPANIES.INSURANCE,
        icon: SecurityIcon,
      },
      {
        name: "Public Company",
        href: ROUTES.DASHBOARD.COMPANIES.PUBLIC,
        icon: BusinessIcon,
      },
      {
        name: "Alliance Company",
        href: ROUTES.DASHBOARD.COMPANIES.ALLIANCE,
        icon: HandshakeIcon,
      },
      {
        name: "Mortgage",
        href: ROUTES.DASHBOARD.COMPANIES.MORTGAGE,
        icon: AccountBalanceIcon,
      },
    ],
  },
  {
    name: "Integrations",
    icon: ApiIcon,
    subItems: [
      {
        name: "AI Tools",
        href: ROUTES.DASHBOARD.INTEGRATIONS.AI_TOOLS,
        icon: SmartToyIcon,
      },
      {
        name: "Quickbooks API",
        href: ROUTES.DASHBOARD.INTEGRATIONS.QUICKBOOKS,
        icon: AccountBalanceIcon,
      },
      {
        name: "Company Cam API",
        href: ROUTES.DASHBOARD.INTEGRATIONS.COMPANYCAM,
        icon: CameraAltIcon,
      },
    ],
  },
  {
    name: "Documents",
    icon: DocumentScannerIcon,
    permission: PERMISSIONS.MANAGE_DOCUMENTS,
    subItems: [
      {
        name: "VG Company",
        href: ROUTES.DASHBOARD.DOCUMENTS.VG_COMPANY,
        icon: ContentPasteIcon,
      },
      {
        name: "Alliance Company",
        href: ROUTES.DASHBOARD.DOCUMENTS.ALLIANCE_COMPANY,
        icon: ReceiptLongIcon,
      },
      {
        name: "Public Adjuster",
        href: ROUTES.DASHBOARD.DOCUMENTS.PUBLIC_ADJUSTER,
        icon: AssignmentIndIcon,
      },
    ],
  },
  {
    name: "Config",
    icon: SettingsIcon,
    permission: PERMISSIONS.MANAGE_CONFIG,
    subItems: [
      {
        name: "Users",
        href: ROUTES.DASHBOARD.CONFIG.USERS,
        icon: PeopleAltIcon,
      },
      {
        name: "Roles",
        href: ROUTES.DASHBOARD.CONFIG.ROLES,
        icon: AdminPanelSettingsIcon,
      },
      {
        name: "Permissions",
        href: ROUTES.DASHBOARD.CONFIG.PERMISSIONS,
        icon: LockIcon,
      },
      {
        name: "Type Damages",
        href: ROUTES.DASHBOARD.CONFIG.TYPE_DAMAGES,
        icon: WarningIcon,
      },
      {
        name: "Cause Of Losses",
        href: ROUTES.DASHBOARD.CONFIG.CAUSE_OF_LOSSES,
        icon: ErrorOutlineIcon,
      },
      {
        name: "Zones",
        href: ROUTES.DASHBOARD.CONFIG.ZONES,
        icon: GridViewIcon,
      },
      {
        name: "VG Company",
        href: ROUTES.DASHBOARD.CONFIG.COMPANY_SIGNATURE,
        icon: DriveFileRenameOutlineIcon,
      },
    ],
  },
];
