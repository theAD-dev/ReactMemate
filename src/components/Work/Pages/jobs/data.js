export const CustomerService = {
    getData() {
        return [
            {
                jobId: 24001,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "09 Dec 2029",
                finish: "09 Dec 2029",
                client: "Emanate Legal",
                jobReference: "Sponsor brochure for Vinkl sailing...",
                name: "John Doe",
                status: "Completed",
                timeAssigned: "07:30h",
                realTime: "08:00h",
                bonus: "$50.00",
                total: "$2,630.44",
                linkTo: "240003"
              },
              {
                jobId: 24002,
                paymentType: "Fix",
                time: "TimeTracker",
                start: "10 Dec 2029",
                finish: "10 Dec 2029",
                client: "Bright Horizons",
                jobReference: "Website redesign consultation...",
                name: "Jane Smith",
                status: "In Progress",
                timeAssigned: "08:00h",
                realTime: "06:45h",
                bonus: "$30.00",
                total: "$1,500.00",
                linkTo: "240004"
              },
              {
                jobId: 24003,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "11 Dec 2029",
                finish: "11 Dec 2029",
                client: "Innovative Solutions",
                jobReference: "Development of AI tool...",
                name: "Alice Johnson",
                status: "Pending",
                timeAssigned: "09:00h",
                realTime: "07:30h",
                bonus: "$40.00",
                total: "$3,100.75",
                linkTo: "240005"
              },
              {
                jobId: 24004,
                paymentType: "Fix",
                time: "TimeTracker",
                start: "12 Dec 2029",
                finish: "12 Dec 2029",
                client: "Quantum Tech",
                jobReference: "App UX/UI design...",
                name: "Mike Brown",
                status: "Canceled",
                timeAssigned: "08:30h",
                realTime: "N/A",
                bonus: "$0.00",
                total: "$500.00",
                linkTo: "240006"
              },
              {
                jobId: 24005,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "13 Dec 2029",
                finish: "13 Dec 2029",
                client: "Zenith Media",
                jobReference: "Content creation for marketing campaign...",
                name: "Chris Green",
                status: "Completed",
                timeAssigned: "10:00h",
                realTime: "08:15h",
                bonus: "$60.00",
                total: "$2,950.00",
                linkTo: "240007"
              }            
        ]
    },
    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    }
}