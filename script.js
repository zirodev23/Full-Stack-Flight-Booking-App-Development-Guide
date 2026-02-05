// script.js

// Sample flight data for demonstration
const sampleFlights = [
    {
        id: 1,
        from: 'New York',
        to: 'London',
        departure: '2026-03-15T10:00:00',
        arrival: '2026-03-15T22:30:00',
        price: 650,
        airline: 'Sky Airlines'
    },
    {
        id: 2,
        from: 'London',
        to: 'Paris',
        departure: '2026-03-16T08:00:00',
        arrival: '2026-03-16T10:30:00',
        price: 180,
        airline: 'EuroFly'
    },
    {
        id: 3,
        from: 'Tokyo',
        to: 'Sydney',
        departure: '2026-03-17T14:00:00',
        arrival: '2026-03-18T06:00:00',
        price: 1200,
        airline: 'Pacific Airways'
    },
    {
        id: 4,
        from: 'Los Angeles',
        to: 'Miami',
        departure: '2026-03-18T09:00:00',
        arrival: '2026-03-18T17:00:00',
        price: 420,
        airline: 'Coastal Air'
    },
    {
        id: 5,
        from: 'Dubai',
        to: 'Singapore',
        departure: '2026-03-19T22:00:00',
        arrival: '2026-03-20T07:30:00',
        price: 750,
        airline: 'Desert Wings'
    }
];

// Initialize localStorage with sample data if empty
function initializeStorage() {
    if (!localStorage.getItem('flights')) {
        localStorage.setItem('flights', JSON.stringify(sampleFlights));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time duration
function formatDuration(departure, arrival) {
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);
    const diffMs = arrTime - depTime;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
}

// Render flight results
function renderFlights(flights) {
    const resultsContainer = document.getElementById('flight-results');
    
    if (flights.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No flights found for your search criteria.</p>';
        return;
    }
    
    resultsContainer.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div class="flight-info">
                <div class="flight-route">
                    <div class="route-city">${flight.from}</div>
                    <div class="route-arrow">→</div>
                    <div class="route-city">${flight.to}</div>
                </div>
                <div class="flight-details">
                    <div class="detail-item">
                        <span class="detail-label">DEPARTURE</span>
                        <span class="detail-value">${formatDate(flight.departure)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ARRIVAL</span>
                        <span class="detail-value">${formatDate(flight.arrival)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DURATION</span>
                        <span class="detail-value">${formatDuration(flight.departure, flight.arrival)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">PASSENGERS</span>
                        <span class="detail-value">${flight.passengerCount}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">AIRLINE</span>
                        <span class="detail-value">${flight.airline}</span>
                    </div>
                </div>
            </div>
            <div class="price">$${flight.totalPrice}<br><small>${flight.passengerCount} x $${flight.price}</small></div>
            <button class="book-button" onclick="bookFlight(${flight.id}, ${flight.passengerCount})">Book Now</button>
        </div>
    `).join('');
}

// Render bookings
function renderBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsContainer = document.getElementById('my-bookings');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>No bookings yet.</p>';
        return;
    }
    
    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-info">
                <div class="flight-route">
                    <div class="route-city">${booking.from}</div>
                    <div class="route-arrow">→</div>
                    <div class="route-city">${booking.to}</div>
                </div>
                <div class="flight-details">
                    <div class="detail-item">
                        <span class="detail-label">DEPARTURE</span>
                        <span class="detail-value">${formatDate(booking.departure)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">PASSENGERS</span>
                        <span class="detail-value">${booking.passengerCount || 1}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">TOTAL PRICE</span>
                        <span class="detail-value">$${booking.totalPrice || booking.price}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">BOOKING ID</span>
                        <span class="detail-value">#${booking.id}</span>
                    </div>
                </div>
            </div>
            <button class="delete-button" onclick="cancelBooking(${booking.id})">Cancel</button>
        </div>
    `).join('');
}

// Search flights
function searchFlights(formData) {
    const flights = JSON.parse(localStorage.getItem('flights')) || [];
    
    // Filter flights based on search criteria
    const filteredFlights = flights.filter(flight => {
        const matchesFrom = flight.from.toLowerCase().includes(formData.from.toLowerCase());
        const matchesTo = flight.to.toLowerCase().includes(formData.to.toLowerCase());
        
        // Check if departure date matches (within a day range for flexibility)
        const flightDate = new Date(flight.departure).toISOString().split('T')[0];
        const searchDate = formData.departure;
        
        return matchesFrom && matchesTo && flightDate === searchDate;
    }).map(flight => {
        // Calculate total price based on passenger count
        const passengerCount = parseInt(formData.passengers);
        return {
            ...flight,
            totalPrice: flight.price * passengerCount,
            passengerCount: passengerCount
        };
    });
    
    renderFlights(filteredFlights);
}

// Book a flight
function bookFlight(flightId, passengerCount = 1) {
    const flights = JSON.parse(localStorage.getItem('flights')) || [];
    const flight = flights.find(f => f.id == flightId);
    
    if (!flight) {
        alert('Flight not found!');
        return;
    }
    
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Generate unique booking ID
    const bookingId = Date.now();
    
    const newBooking = {
        id: bookingId,
        ...flight,
        passengerCount: passengerCount,
        totalPrice: flight.price * passengerCount
    };
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    renderBookings();
    alert(`${passengerCount} ticket(s) for flight from ${flight.from} to ${flight.to} booked successfully! Total: $${newBooking.totalPrice}`);
}

// Cancel a booking
function cancelBooking(bookingId) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings = bookings.filter(booking => booking.id != bookingId);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    renderBookings();
    alert('Booking cancelled successfully!');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    renderBookings();
    
    // Set minimum date for departure to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departure').min = today;
    
    // Handle form submission
    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            from: document.getElementById('from').value,
            to: document.getElementById('to').value,
            departure: document.getElementById('departure').value,
            return: document.getElementById('return').value,
            passengers: document.getElementById('passengers').value
        };
        
        searchFlights(formData);
    });
});