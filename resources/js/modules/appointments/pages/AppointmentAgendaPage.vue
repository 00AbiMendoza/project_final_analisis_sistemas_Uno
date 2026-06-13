<template>
    <section class="agenda">
        <div class="agenda__header">
            <div>
                <p class="agenda__eyebrow">Módulo 12</p>
                <h1 class="agenda__title">Agenda de citas</h1>
                <p class="agenda__subtitle">
                    Consulta diaria o semanal de citas médicas programadas.
                </p>
            </div>

            <div class="agenda__actions">
                <button
                    class="agenda__button"
                    :class="{ 'agenda__button--active': viewMode === 'day' }"
                    type="button"
                    @click="viewMode = 'day'"
                >
                    Día
                </button>
                <button
                    class="agenda__button"
                    :class="{ 'agenda__button--active': viewMode === 'week' }"
                    type="button"
                    @click="viewMode = 'week'"
                >
                    Semana
                </button>
            </div>
        </div>

        <div class="agenda__filters">
            <label class="agenda__field">
                Fecha
                <input v-model="selectedDate" class="agenda__input" type="date">
            </label>

            <label class="agenda__field">
                Estado
                <select v-model="statusFilter" class="agenda__input">
                    <option value="all">Todos</option>
                    <option value="Programada">Programada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Atendida">Atendida</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </label>

            <label class="agenda__field agenda__field--wide">
                Buscar
                <input
                    v-model="searchTerm"
                    class="agenda__input"
                    type="search"
                    placeholder="Paciente, médico o motivo"
                >
            </label>

            <div class="agenda__filter-actions">
                <button class="agenda__button" type="button" @click="clearFilters">
                    Limpiar filtros
                </button>
            </div>
        </div>

        <div class="agenda__summary">
            <article class="agenda__card">
                <span>Citas visibles</span>
                <strong>{{ visibleAppointments.length }}</strong>
            </article>
            <article class="agenda__card">
                <span>Vista activa</span>
                <strong>{{ viewMode === 'day' ? 'Diaria' : 'Semanal' }}</strong>
            </article>
            <article class="agenda__card">
                <span>Rango consultado</span>
                <strong>{{ agendaRangeLabel }}</strong>
            </article>
        </div>

        <div class="agenda__list">
            <article
                v-for="appointment in visibleAppointments"
                :key="appointment.id"
                class="appointment"
            >
                <div class="appointment__time">
                    <strong>{{ appointment.time }}</strong>
                    <span>{{ formatDate(appointment.date) }}</span>
                </div>

                <div class="appointment__body">
                    <h2>{{ appointment.patient }}</h2>
                    <p>{{ appointment.reason }}</p>
                    <span>{{ appointment.doctor }}</span>
                </div>

                <span class="appointment__status" :class="statusClass(appointment.status)">
                    {{ appointment.status }}
                </span>
            </article>

            <div v-if="visibleAppointments.length === 0" class="agenda__empty">
                No hay citas para los filtros seleccionados.
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const defaultDate = '2026-06-13';

const selectedDate = ref(defaultDate);
const viewMode = ref('day');
const statusFilter = ref('all');
const searchTerm = ref('');

const appointments = [
    {
        id: 1,
        date: '2026-06-13',
        time: '08:00',
        patient: 'María López',
        doctor: 'Dra. Ana Morales',
        reason: 'Consulta general',
        status: 'Programada',
    },
    {
        id: 2,
        date: '2026-06-13',
        time: '09:30',
        patient: 'Carlos Méndez',
        doctor: 'Dr. Luis Herrera',
        reason: 'Control de laboratorio',
        status: 'Confirmada',
    },
    {
        id: 3,
        date: '2026-06-13',
        time: '11:00',
        patient: 'Rosa Castillo',
        doctor: 'Dra. Carmen Ruiz',
        reason: 'Seguimiento clínico',
        status: 'Atendida',
    },
    {
        id: 4,
        date: '2026-06-14',
        time: '10:00',
        patient: 'Jorge Ramírez',
        doctor: 'Dr. Mario Pérez',
        reason: 'Evaluación médica',
        status: 'Programada',
    },
    {
        id: 5,
        date: '2026-06-16',
        time: '14:00',
        patient: 'Lucía Gómez',
        doctor: 'Dra. Ana Morales',
        reason: 'Revisión de resultados',
        status: 'Cancelada',
    },
];

const agendaRangeLabel = computed(function () {
    if (viewMode.value === 'day') {
        return formatDate(selectedDate.value);
    }

    const start = new Date(selectedDate.value + 'T00:00:00');
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return formatDate(selectedDate.value) + ' - ' + formatDate(toInputDate(end));
});

const visibleAppointments = computed(function () {
    return appointments
        .filter(function (appointment) {
            return matchesStatus(appointment)
                && matchesDateRange(appointment)
                && matchesSearch(appointment);
        })
        .sort(function (first, second) {
            return String(first.date + first.time).localeCompare(second.date + second.time);
        });
});

function matchesStatus(appointment) {
    return statusFilter.value === 'all'
        || appointment.status === statusFilter.value;
}

function matchesDateRange(appointment) {
    if (viewMode.value === 'day') {
        return appointment.date === selectedDate.value;
    }

    const start = new Date(selectedDate.value + 'T00:00:00');
    const current = new Date(appointment.date + 'T00:00:00');
    const difference = (current - start) / 86400000;

    return difference >= 0 && difference < 7;
}

function matchesSearch(appointment) {
    const term = searchTerm.value.trim().toLowerCase();

    if (!term) return true;

    return appointment.patient.toLowerCase().includes(term)
        || appointment.doctor.toLowerCase().includes(term)
        || appointment.reason.toLowerCase().includes(term);
}

function clearFilters() {
    selectedDate.value = defaultDate;
    viewMode.value = 'day';
    statusFilter.value = 'all';
    searchTerm.value = '';
}

function formatDate(value) {
    const date = new Date(value + 'T00:00:00');

    return new Intl.DateTimeFormat('es-GT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function toInputDate(date) {
    return date.toISOString().slice(0, 10);
}

function statusClass(status) {
    return {
        'appointment__status--scheduled': status === 'Programada',
        'appointment__status--confirmed': status === 'Confirmada',
        'appointment__status--completed': status === 'Atendida',
        'appointment__status--cancelled': status === 'Cancelada',
    };
}
</script>

<style scoped>
.agenda {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.agenda__header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
}

.agenda__eyebrow {
    color: #2563eb;
    font-weight: 700;
    margin: 0 0 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.75rem;
}

.agenda__title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
}

.agenda__subtitle {
    color: #475569;
    margin: 0.5rem 0 0;
}

.agenda__actions,
.agenda__filter-actions {
    display: flex;
    gap: 0.5rem;
}

.agenda__filter-actions {
    align-items: flex-end;
}

.agenda__button {
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #0f172a;
    border-radius: 8px;
    padding: 0.55rem 0.9rem;
    cursor: pointer;
    font-weight: 600;
}

.agenda__button--active {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
}

.agenda__filters,
.agenda__summary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 220px));
    gap: 1rem;
}

.agenda__filters {
    grid-template-columns: 180px 180px minmax(240px, 1fr) auto;
}

.agenda__summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.agenda__filters,
.agenda__card,
.appointment,
.agenda__empty {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
}

.agenda__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: #334155;
    font-size: 0.9rem;
}

.agenda__field--wide {
    min-width: 240px;
}

.agenda__input {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    font-size: 1rem;
}

.agenda__card span {
    display: block;
    color: #64748b;
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
}

.agenda__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.appointment {
    display: grid;
    grid-template-columns: 140px 1fr auto;
    gap: 1rem;
    align-items: center;
}

.appointment__time,
.appointment__body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.appointment__time span,
.appointment__body span {
    color: #64748b;
    font-size: 0.85rem;
}

.appointment__body h2,
.appointment__body p {
    margin: 0;
}

.appointment__body h2 {
    font-size: 1rem;
}

.appointment__body p {
    color: #475569;
}

.appointment__status {
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 700;
    background: #e2e8f0;
    color: #334155;
}

.appointment__status--scheduled {
    background: #dbeafe;
    color: #1d4ed8;
}

.appointment__status--confirmed {
    background: #dcfce7;
    color: #15803d;
}

.appointment__status--completed {
    background: #fef3c7;
    color: #92400e;
}

.appointment__status--cancelled {
    background: #fee2e2;
    color: #b91c1c;
}

.agenda__empty {
    color: #64748b;
    text-align: center;
}

@media (max-width: 960px) {
    .agenda__filters {
        grid-template-columns: 1fr 1fr;
    }

    .agenda__field--wide,
    .agenda__filter-actions {
        grid-column: 1 / -1;
    }
}

@media (max-width: 760px) {
    .agenda__header,
    .appointment {
        display: grid;
        grid-template-columns: 1fr;
    }

    .agenda__filters,
    .agenda__summary {
        grid-template-columns: 1fr;
    }

    .agenda__field--wide,
    .agenda__filter-actions {
        grid-column: auto;
    }
}
</style>