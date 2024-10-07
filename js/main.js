/****************************************************************************
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Assignment: 2247 / 2
 * Student Name: Tomi Ige
 * Student Email: ooige1@myseneca.ca
 * Course/Section: WEB422/ZAA
 * Cyclic URL: https://web422ass1.vercel.app
 *
 *****************************************************************************/


let page = 1; // Tracks the current page the user is viewing
const perPage = 15; // Number of listings to display per page
let searchName = null; // Current search value, defaults to null
let listingsData = [];

// Table template for listings
const listingsTableTemplate = _.template(
    `<% _.forEach(listingsData, function(listing) { %>
        <tr data-id="<%- listing._id %>">
            <td><%- listing.name %></td>
            <td><%- listing.room_type %></td>
            <td><%- listing.address.street %></td>
            <td>
                <%- listing.summary ? listing.summary : "No summary available" %><br/><br/>
                <strong>Accommodates:</strong> <%- listing.accommodates %><br/>
                <strong>Rating:</strong> <%- listing.review_scores ? listing.review_scores.review_scores_rating : "N/A" %> (<%- listing.number_of_reviews %> Reviews)
            </td>
        </tr>
    <% }); %>`
);

// Function to load listings data
function loadListingsData() {
    // Construct the fetch URL based on searchName
    let url = `https://web422ass1.vercel.app/api/listings?page=${page}&perPage=${perPage}`;
    if (searchName) {
        url += `&name=${searchName}`;
    }

    // Fetch data from the API
    fetch(url)
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
                return Promise.reject(response.status); // Reject with status if not ok
            }
            return response.json(); 
        })

        .then(data => {
           // Check if data is empty
           if (data.length === 0) {
            // If on a non-first page, go back one page
            if (page > 1) {
                page--;
            } else {
                // Display a message for no data available
                document.querySelector("#listingsTable tbody").innerHTML = `
                    <tr><td colspan="4"><strong>No data available</strong></td></tr>`;
            }
        } else {
            // Populate the table with data
            listingsData = data; // Store the listings data
            let rows = listingsData.map(listing => `
                <tr data-id="${listing._id}">
                    <td>${listing.name}</td>
                    <td>${listing.room_type}</td>
                    <td>${listing.address.street}, ${listing.address.city}, ${listing.address.state}</td>
                    <td>
                        ${listing.summary || "No summary available."}<br/><br/>
                        <strong>Accommodates:</strong> ${listing.accommodates}<br/>
                        <strong>Rating:</strong> ${listing.review_scores?.review_scores_rating || "N/A"} (${listing.number_of_reviews || 0} Reviews)
                    </td>
                </tr>`).join("");

            // Update the table body
            document.querySelector("#listingsTable tbody").innerHTML = rows;
        }
        // Update current page display
        document.getElementById("current-page").innerText = page;

        // Add click event listeners to the rows
        addRowClickEvents();
    })

    .catch(err => {
        console.error("Error fetching listings:", err);
        // Handle error by checking if page is greater than 1
        if (page > 1) {
            page--; // Go back one page
            loadListingsData(); // Try to load listings again
        } else {
            // Display a message for no data available
            document.querySelector("#listingsTable tbody").innerHTML = `
                <tr>
                    <td colspan="4"><strong>No data available</strong></td>
                </tr>`;
        }
    });
}

// Function to add click events to each listing row
function addRowClickEvents() {
const rows = document.querySelectorAll("#listingsTable tbody tr");
rows.forEach(row => {
    row.addEventListener("click", function() {
        const id = this.getAttribute("data-id");
        showModal(id); // Show the modal with the listing details
    });
});
}

// Function to show the modal with listing details
function showModal(id) {
// Fetch the details for the selected listing
fetch(`https://your-api-url.com/api/listings/${id}`)
    .then(response => response.json())
    .then(data => {
        // Populate the modal with data
        document.querySelector("#modal-title").innerText = data.name;
        document.querySelector("#modal-body").innerHTML = `
            <div class="modal-body">
                <img id="photo" 
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" 
                    class="img-fluid w-100" 
                    src="${data.images?.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available'}">
                <br/><br/>
                ${data.neighborhood_overview || "No overview available."}<br/><br/>
                <strong>Price:</strong> $${data.price.toFixed(2)}<br/>
                <strong>Room:</strong> ${data.room_type}<br/>
                <strong>Bed:</strong> ${data.bed_type} (${data.beds || 0})<br/><br/>
            </div>`;
        // Show the modal
        $('#detailsModal').modal('show');
    })
    .catch(err => {
        console.error("Error fetching listing details:", err);
    });
}

// Document ready event
document.addEventListener("DOMContentLoaded", function() {
loadListingsData(); // Load data when the document is ready

// Previous page button event
document.getElementById("previous-page").addEventListener("click", function() {
    if (page > 1) {
        page--; // Decrease page number
        loadListingsData(); // Load new listings data
    }
});

// Next page button event
document.getElementById("next-page").addEventListener("click", function() {
    page++; // Increase page number
    loadListingsData(); // Load new listings data
});

// Search form submit event
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    searchName = document.getElementById("searchName").value; // Get search value
    page = 1; // Reset page number
    loadListingsData(); // Load listings data with new search
});
});