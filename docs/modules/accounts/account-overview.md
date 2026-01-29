# 💳 ACCOUNT - Accounts Module Overview

**Module ID**: `account`  
**Versión**: 1.0  
**Última actualización**: 2026-01-26  
**Propósito**: Consulta detallada y edición transaccional de cuentas de tarjetas de crédito, incluyendo validaciones de negocio y protección de datos sensibles durante todo el ciclo de vida de la cuenta de cliente

---

## 📋 Contexto de Negocio y Alcance

El módulo ACCOUNT atiende a representantes de servicio y administradores que necesitan explorar la salud financiera de una cuenta, revisar tarjetas asociadas y ejecutar cambios críticos (límites, estado, datos personales). El objetivo es mantener información de cuentas actualizada, responder consultas regulatorias y habilitar decisiones de crédito rápidas.

### Responsabilidades Principales

- Buscar cuentas por Account ID de 11 dígitos dentro de `CardXrefRecord → Account → Customer`.
- Mostrar detalles financieros y personales (límites, balances, `FICO Score`, direcciones, SSN enmascarado).
- Permitir actualizaciones transaccionales de `Account` y `Customer` con comparaciones automáticas de estado.
- Validar reglas críticas (status activo, formato ZIP, rango FICO, SSN/Account ID no trivial).
- Proteger datos sensibles en vistas (SSN y tarjetas enmascaradas) y respetar reglas de auditoría.

---

## 🏗️ Fundación Técnica del Módulo

### Componentes Frontend Clave

- **AccountViewScreen.tsx**: Página principal de consulta con tarjetas de estado, balances y resumen de tarjetas asociadas. Reutiliza utilidades de mascarado como `maskSSN` y `maskCard`.
- **AccountUpdateScreen.tsx**: Pantalla de edición con `Edit mode toggle`, validaciones inline y detección automática de cambios con indicador visual.
- **AccountViewPage.tsx / AccountUpdatePage.tsx**: Enrutamiento React Router hacia vistas protegidas; aplican `ProtectedRoute`.
- **useAccountView.ts**: Hook personalizado que maneja estados (`loading`, `error`, `data`), formatea `accountId` y lanza errores si el ID no es válido.
- **useAccountUpdate.ts**: Hook especializado en comparación JSON del formulario y envío al backend con control de errores y notificaciones Snackbar.

### Componentes Backend Clave

- **AccountViewService.java**: Lectura de tres entidades relacionadas, uso de `@Transactional(readOnly = true)` y mascarado de campos sensibles antes de exponer datos.
- **AccountUpdateService.java**: Actualización atómica de `Account` y `Customer` con `@Transactional`; pre-carga con `READ FOR UPDATE` para evitar condiciones de carrera.
- **AccountValidationService.java**: Validaciones comunes de `FICO Score`, `ZIP`, `status`, `SSN`, `accountId` y reglas de negocio.

---

## 🔗 Interfaces Públicas (APIs)

### GET /api/account-view?accountId={id}
**Descripción**: Busca cuenta completa con datos de cliente y tarjetas.
**Response**: `AccountViewResponseDto` (JSON) que incluye `accountId`, `accountStatus`, `creditLimit`, `currentBalance`, `customerSsn` enmascarado y `ficoScore`.

### GET /api/account-view/initialize
**Descripción**: Proporciona metadata inicial (transactionId, timestamp) para la pantalla de consulta.
**Response**: `AccountViewResponseDto` con campos adicionales de contexto.

### GET /api/accounts/{accountId}
**Descripción**: Obtiene payload de edición (`AccountUpdateRequestDto`) con valores actuales de cuenta y cliente.
**Response**: JSON plano del DTO, uso directo en formularios React.

### PUT /api/accounts/{accountId}
**Descripción**: Actualiza `Account` y `Customer` en operación transaccional.
**Request**: `AccountUpdateRequestDto` (credits, nombres, direcciones, flags de status).
**Response**: `Map<String, String>` con mensaje de éxito.

---

## 📊 Modelos de Datos Principales

### `AccountViewResponse`
```ts
interface AccountViewResponse {
  accountId: number;
  accountStatus: 'Y' | 'N';
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  customerId: number;
  customerSsn: string; // Enmascarado: ***-**-XXXX
  ficoScore: number;   // 300-850
  firstName: string;
  lastName: string;
  zipCode: string;
  cards: CreditCardSummary[];
}
```

### Backend (Java Entities)
```java
@Entity
public class Account {
  @Id private Long accountId;            // 11 dígitos
  private String activeStatus;           // 'Y' | 'N'
  private BigDecimal creditLimit;
  private BigDecimal currentBalance;
  private LocalDate openDate;
  // ... otros 20+ campos financieros
}

@Entity
public class Customer {
  @Id private Long customerId;           // 9 dígitos
  private String socialSecurityNumber;    // 9 dígitos
  private Integer ficoScore;              // 300-850
  private String zipCode;
  private String firstName;
  private String lastName;
  // ... otros campos de contacto
}
```

---

## 📋 Reglas de Negocio

1. **RN-001**: `accountId` debe tener exactamente 11 dígitos numéricos y no puede ser `00000000000`.
2. **RN-002**: Solo cuentas con `status = 'Y'` pueden ejecutar transacciones o ediciones activas.
3. **RN-003**: La búsqueda recorre `CardXrefRecord → Account → Customer` y detiene si alguna entidad falta.
4. **RN-006**: `SSN` se muestra enmascarado como `***-**-XXXX`.
5. **RN-007**: Los números de tarjeta asociados se enmascaran como `****-****-****-XXXX`.
6. **RN-009**: `activeStatus` solo admite `'Y'` (activo) o `'N'` (inactivo).
7. **RN-012**: `ficoScore` debe estar entre `300` y `850`.
8. **RN-015**: `ZIP Code` sigue el patrón `^\d{5}(-\d{4})?$`.
9. **RN-018**: Actualización de `Account` y `Customer` es atómica; cualquier error genera rollback automático.
10. **RN-021**: Se ejecuta `READ FOR UPDATE` antes de modificar para garantizar locking pesimista.

---

## 🎯 Patrones de User Stories

- **Simple (1-2 pts)**: “Como oficial de crédito, quiero visualizar el balance actual de una cuenta para responder preguntas de clientes.”
- **Medio (3-5 pts)**: “Como administrador, quiero actualizar el límite de crédito cuando el FICO mejora para reflejar la nueva capacidad.”
- **Complejo (5-8 pts)**: “Como supervisor, quiero implementar un workflow de aprobación para cambios de límite > $10,000 con notificaciones y auditoría.”

### Criterios de Aceptación Recurrentes

- **Autenticación**: Solo usuarios con rol `Customer Service` o `Admin` acceden. El módulo valida token antes de cargar.
- **Validación**: El formulario valida `accountId` y `zipcode`; 11 dígitos exactos y regex `^\d{5}(-\d{4})?$`.
- **Performance**: Consultas retornan en < 500ms (P95).
- **Errores**: Se muestra “Account not found in Cross ref file” si el ID no existe. Errores de validación se presentan en Snackbar (frontend).

---

## ⚡ Factores de Aceleración

- `useAccountView` y `useAccountUpdate` encapsulan carga/actualización, validación inline y estados (`loading`, `error`, `success`), habilitando nuevas vistas con poco código.
- `AccountValidationService` centraliza reglas para evitar duplicación entre UI y backend.
- Data masking utilities (`maskSSN`, `maskCard`, `maskAccountId`) están disponibles para otras vistas sensibles.
- Material-UI (MUI) provee `TextField`, `Card`, `Button`, `IconButton` y `Snackbar` listos para nuevas pantallas.

---

## 🔄 Dependencias y Colaboraciones

- **Módulos dependientes**: `AUTH` (protege rutas y tokens), `TRANSACTION` (consume `availableCredit`), `CREDIT CARD` (relaciones de tarjetas), `UI` (componentes compartidos).
- **Servicios compartidos**: `AccountValidationService`, `CustomerRepository`, `CardXrefRepository`.
- **Infraestructura**: PostgreSQL con índices en `accountId`, `customerId` y `cardNumber`.

---

## 🚨 Riesgos y Observaciones de Readiness

1. **Performance de consultas multi-tabla** → Indexar `accountId`/`customerId`, considerar caché Redis para cuentas frecuentes.
2. **Falta de i18n oficial** → Mensajes hardcodeados (inicialmente en inglés) se documentan como deuda.
3. **Ausencia de auditoría de cambios** → Se propone Audit Trail con Spring Data Envers para versiones futuras.
4. **Validaciones heredadas (COBOL)** → Revisar y modernizar las validaciones de SSN que hoy están comentadas.

---

## 🎯 Métricas de Éxito

- **Adopción**: 100% de consultas de back-office usan el módulo `ACCOUNT`.
- **Performance**: Tiempo de búsqueda < 500ms, actualización < 1s (P95).
- **Calidad**: 0 errores críticos en validaciones de datos sensibles por release.

---

## 📚 Enlaces Relacionados

- [Guía de desarrollo detallada (HTML)](../../site/modules/accounts/index.html)
- [System Overview completo](../../system-overview.md)
- [Documentación del módulo AUTH](../auth/auth-overview.md)
