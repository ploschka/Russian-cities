const $ = require('jquery');

const table = [
    { name: "Москва", subject: "Москва", year: 1147, count: 13010112, density: 5079.1 },
    { name: "Санкт-Петербург", subject: "Санкт-Петербург", year: 1703, count: 5601911, density: 3992.81 },
    { name: "Саратов", subject: "Саратовская область", year: 1590, count: 901361, density: 1074.84 },
    { name: "Хабаровск", subject: "Хабаровский край", year: 1858, count: 617441, density: 1599.59 },
    { name: "Сызрань", subject: "Самарская область", year: 1683, count: 165725, density: 1416.45 },
    { name: "Челябинск", subject: "Челябинская область", year: 1736, count: 1189525, density: 2371.6 },
    { name: "Новосибирск", subject: "Новосибирская область", year: 1893, count: 1633595, density: 3230.87 },
    { name: "Екатеринбург", subject: "Свердловская область", year: 1723, count: 1544376, density: 1389.2 },
    { name: "Казань", subject: "Республика Татарстан", year: 1005, count: 1308660, density: 2221.89 },
    { name: "Нижний Новгород", subject: "Нижегородская область", year: 1221, count: 1249861, density: 3043.39 },
    { name: "Ростов-на-Дону", subject: "Ростовская область", year: 1749, count: 1142162, density: 3277.37 },
    { name: "Воронеж", subject: "Воронежская область", year: 1586, count: 1057681, density: 1767.84 },
    { name: "Сочи", subject: "Краснодарский край", year: 1838, count: 466078, density: 2636.64 },
    { name: "Симферополь", subject: "Республика Крым", year: 1784, count: 340540, density: 3170.47 },
];

const _ = console.log;

const options = [
    "Нет",
    "Название",
    "Субъект Федерации",
    "Год основания",
    "Население",
    "Плотность",
];

const option_names = [
    "",
    "name",
    "subject",
    "year",
    "count",
    "density"
];

const filter = {
    name: null,
    subject: null,
    year_from: null,
    year_to: null,
    count_from: null,
    count_to: null,
    density_from: null,
    density_to: null
};

const sort = {
    first: null,
    second: null,
    third: null,
    first_rev: false,
    second_rev: false,
    third_rev: false
};

$(() => {
    const filter_options = $(`.search-option`);
    filter_options.val('');

    const sort_options = $(`.sort-option`);

    const datatable = $(`#datatable-body`);
    const sort_select = $(`.sort-select`);

    const rerender = arr => {
        datatable.html(``);
        arr = arr.filter(e => {
            return (e.name.startsWith(filter.name) || filter.name === null) &&
                (e.subject.startsWith(filter.subject) || filter.subject === null) &&
                (e.year >= Number(filter.year_from) || filter.year_from === null) &&
                (e.year <= Number(filter.year_to) || filter.year_to === null) &&
                (e.count >= Number(filter.count_from) || filter.count_from === null) &&
                (e.count <= Number(filter.count_to) || filter.count_to === null) &&
                (e.density >= Number(filter.density_from) || filter.density_from === null) &&
                (e.density <= Number(filter.density_to) || filter.density_to === null)
                ;
        });
        if (arr.length === 0) {
            datatable.append(
                `<tr>
                    <td colspan="5" style="text-align: center;">По заданным фильтрам ничего не найдено</td>
                </tr>`
            );
        } else {
            if (sort.first !== null) {
                arr.sort((e1, e2) => {
                    if (sort.first_rev) {
                        return e1[sort.first] < e2[sort.first];
                    } else {
                        return e1[sort.first] > e2[sort.first];
                    }
                });
            }

            if (sort.second !== null) {
                arr.sort((e1, e2) => {
                    if (sort.second_rev) {
                        return e1[sort.second] < e2[sort.second];
                    } else {
                        return e1[sort.second] > e2[sort.second];
                    }
                });
            }

            if (sort.third !== null) {
                arr.sort((e1, e2) => {
                    if (sort.third_rev) {
                        return e1[sort.third] < e2[sort.third];
                    } else {
                        return e1[sort.third] > e2[sort.third];
                    }
                });
            }

            arr.forEach(e => {
                datatable.append(
                    `<tr>                              
                        <td>${e.name}</td>
                        <td>${e.subject}</td>
                        <td>${e.year}</td>
                        <td>${e.count}</td>
                        <td>${e.density}</td>
                    </tr>`
                );
            });
        }
    }
    options.forEach((e, j) => {
        sort_select.append(`<option value="${option_names[j]}">${e}</option>`);
    });

    const hide_options = (index, wasopt, newopt) => {
        sort_select.children(`[value="${wasopt}"]`).filter(i => i !== index).show()
        sort_select.children(`[value="${newopt}"]`).filter(i => i !== index).hide();
    };

    rerender(table);

    filter_options.on('input', e => {
        filter[e.target.attributes['opt'].value] = (e.target.value === '') ? null : e.target.value;
        rerender(table);
    })
    sort_select.on('input', e => {
        let level = e.target.attributes["lvl"].value;
        const index = (level === "first")? 0 : (level === "second") ? 1 : (level === "third") ? 2 : -1;
        const value = (e.target.value === '') ? null : e.target.value;
        hide_options(index, sort[level], value);
        sort[level] = value;
        rerender(table);
    });
    sort_options.filter('.sort-checkbox').on('change', e => {
        sort[e.target.attributes["lvl"].value] = e.target.checked;
        rerender(table);
    });
});
