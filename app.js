const host = "https://server.vippo.ru/api";

const app = Vue.createApp({
    data() {
        return {
            page: "index",

            addBooking: {
                in: null,
                out: null,
                amount_guests: null,
                room_category_id: null,
                email: null,
                phone: null,
                city: null,
                guests: [],
            },
            info_category: [],
            categories: [],
            photo: "url('assets/images/hotel.jpg')"
        };
    },
    mounted() {

    },
    methods: {
        openPage(page) {
            if (this.page == "index" || this.page == "login") {
                this.photo = "url('assets/images/hotel.jpg')"
            } else {
                this.photo = ""
            }


            if (this.page == "index") {
                const errors = [];

                if (!this.addBooking.in) {
                    errors.push('выберите дату заезда');
                } else if (!this.validateDate(this.addBooking.in)) {
                    errors.push('дата заезда должна быть позже сегодняшнего дня');
                }

                if (!this.addBooking.out) {
                    errors.push('выберите дату выезда');
                } else if (!this.validateDate(this.addBooking.out)) {
                    errors.push('дата выезда должна быть позже сегодняшнего дня');
                } else if (new Date(this.addBooking.out) <= new Date(this.addBooking.in)) {
                    errors.push('дата выезда должна быть позже даты заезда');
                }

                if (!this.addBooking.amount_guests) {
                    errors.push('выберите количество гостей');
                }

                if (errors.length > 0) {
                    alert('Пожалуйста:\n' + errors.map(err => '• ' + err).join('\n'));
                    return;
                }
            }


            if (page == "addBooking") {
                this.addBooking.guests = []
                for (i = 0; i < this.addBooking.amount_guests; i++) {
                    this.addBooking.guests.push({
                        "name": null,
                        "surname": null,
                        "patronymic": null,
                        "birthday": null,
                        "gender": null,
                        "document_type_id": null,
                        "document_number": null
                    })
                }
                this.loadCategory()
            }
            this.page = page
        },


        validateDate(date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(date);
            return selectedDate > today;
        },
        // букинг
        loadCategory() {

            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            fetch("http://server.vippo.ru/api/category", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.categories = result
                })
                .catch((error) => console.error(error));
        },
        oneCategory(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch("http://server.vippo.ru/api/category/" + id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.info_category = result.data
                    this.openPage('category')
                    console.log(result)
                })
                .catch((error) => console.error(error));
        },
        booking(page) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "arr_date": this.addBooking.in,
                "dep_date": this.addBooking.out,
                "room_category_id": this.addBooking.room_category_id,
                "email": this.addBooking.email,
                "phone": this.addBooking.phone,
                "city": this.addBooking.city,

                "guests": this.addBooking.guests
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://server.vippo.ru/api/booking", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    this.page = page
                    console.log = this.booking.guests
                    console.log = result
                })
                .catch((error) => console.error(error));
        },

        addGuest() {
            this.addBooking.amount_guests = +this.addBooking.amount_guests + 1
            this.addBooking.guests.push({
                "name": null,
                "surname": null,
                "patronymic": null,
                "birthday": null,
                "gender": null,
                "document_type_id": null,
                "document_number": null
            })
        },
        deleteGuest(i) {
            this.addBooking.guests.splice(i, 1)
            this.addBooking.amount_guests = +this.addBooking.amount_guests - 1
        },
        // букинг end


    }
}).mount("#app");

