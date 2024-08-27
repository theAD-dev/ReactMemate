export const CustomerService = {
    getData() {
        return [
            {
                Name: "Bessie Cooper",
                type: "Employee",
                LastJob: "J-230064-1",
                Group: "Group 1",
                Rating: "*****",
                DaysCcompany: "55",
                HourlyRate: "$31",
                JobsComplete: "12",
                Email: "info@abc.com",
                Phone: "Icon",
                Status: "Active",
                total: "$2,630.44",
                linkTo: "240003"
              },



           






              {
                Name: "Bessie Cooper",
                type: "Employee",
                LastJob: "J-230064-2",
                Group: "Group 1",
                Rating: "*****",
                DaysCcompany: "55",
                HourlyRate: "$31",
                JobsComplete: "12",
                Email: "info@abc.com",
                Phone: "Icon",
                Status: "Active",
                total: "$2,630.44",
                linkTo: "240003"
              },
              {
                Name: "Bessie Cooper",
                type: "Employee",
                LastJob: "J-230064-3",
                Group: "Group 1",
                Rating: "*****",
                DaysCcompany: "55",
                HourlyRate: "$31",
                JobsComplete: "12",
                Email: "info@abc.com",
                Phone: "Icon",
                Status: "Active",
                total: "$2,630.44",
                linkTo: "240003"
              },
              {
                Name: "Bessie Cooper",
                type: "Employee",
                LastJob: "J-230064-5",
                Group: "Group 1",
                Rating: "*****",
                DaysCcompany: "55",
                HourlyRate: "$31",
                JobsComplete: "12",
                Email: "info@abc.com",
                Phone: "Icon",
                Status: "Active",
                total: "$2,630.44",
                linkTo: "240003"
              },
              {
                Name: "Bessie Cooper",
                type: "Employee",
                LastJob: "J-230064-9",
                Group: "Group 1",
                Rating: "*****",
                DaysCcompany: "55",
                HourlyRate: "$31",
                JobsComplete: "12",
                Email: "info@abc.com",
                Phone: "Icon",
                Status: "Active",
                total: "$2,630.44",
                linkTo: "240003"
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