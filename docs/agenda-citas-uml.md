# Sprint 3 - Diagramas UML del módulo Agenda de citas

## Módulo asignado

Módulo 12: Agenda de citas.

El módulo permite consultar citas médicas programadas en una vista diaria o semanal. Incluye filtros por fecha, estado y búsqueda por paciente, médico o motivo de la cita.

## Diagrama de caso de uso

```mermaid
flowchart LR
    Usuario((Usuario del sistema))
    UC1[Consultar agenda de citas]
    UC2[Seleccionar vista diaria]
    UC3[Seleccionar vista semanal]
    UC4[Filtrar por fecha]
    UC5[Filtrar por estado]
    UC6[Buscar cita]
    UC7[Limpiar filtros]

    Usuario --> UC1
    Usuario --> UC2
    Usuario --> UC3
    Usuario --> UC4
    Usuario --> UC5
    Usuario --> UC6
    Usuario --> UC7
```

## Diagrama de clases

```mermaid
classDiagram
    class AppointmentAgendaPage {
        selectedDate
        viewMode
        statusFilter
        searchTerm
        appointments
        visibleAppointments
        agendaRangeLabel
        clearFilters()
        formatDate(value)
        statusClass(status)
    }

    class Appointment {
        id
        date
        time
        patient
        doctor
        reason
        status
    }

    class Router {
        path
        name
        component
    }

    class AppLayout {
        navigationLinks
    }

    AppointmentAgendaPage --> Appointment
    Router --> AppointmentAgendaPage
    AppLayout --> Router
```

## Diagrama de secuencia

```mermaid
sequenceDiagram
    actor Usuario
    participant Layout as AppLayout
    participant Router as Vue Router
    participant Agenda as AppointmentAgendaPage

    Usuario->>Layout: Selecciona Agenda de citas
    Layout->>Router: Navega a /agenda-citas
    Router->>Agenda: Carga componente de agenda
    Agenda->>Agenda: Inicializa fecha, vista y citas
    Usuario->>Agenda: Selecciona fecha, vista o estado
    Agenda->>Agenda: Filtra citas visibles
    Agenda-->>Usuario: Muestra citas programadas
    Usuario->>Agenda: Usa busqueda o limpia filtros
    Agenda->>Agenda: Recalcula resultados
    Agenda-->>Usuario: Actualiza listado de citas
```

## Relación con los sprints

### Sprint 1

Se creó la estructura base del módulo, la ruta /agenda-citas, el enlace de navegación y una vista funcional inicial para consultar citas.

### Sprint 2

Se mejoró la vista con búsqueda, limpieza de filtros, ordenamiento por fecha y hora, y resumen del rango consultado.

### Sprint 3

Se documentó el diseño base mediante diagramas UML de caso de uso, clases y secuencia.