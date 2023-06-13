let _ = console.log;

const getArrGraph = (arrObject, fieldX, fieldY) => {
    // сформируем список меток по оси OX (различные элементы поля fieldX)
    // см. стр. 8-9 Теоретического материала к ЛР
    let groupObj = d3.group(arrObject.sort((e1, e2) => e1[fieldX] > e2[fieldX]), e => e[fieldX]);

    arrGroup = []; // массив объектов для построения графика
    for (let entry of groupObj) {
        //выделяем минимальное и максимальное значения поля fieldY
        //для очередной метки по оси ОХ
        let minMax = entry[1].map(e => e[fieldY]);
        let min = d3.min(minMax);
        let max = d3.max(minMax);
        let elementGroup = { "labelX": entry[0], "valueMin": min, "valueMax": max };
        arrGroup.push(elementGroup);
    }
    return arrGroup;
};

function drawGraph(data) {
    let form = d3.select(data);
    let type = form.selectAll(`.T`).filter((e, i, n) => {
        return n[i].checked;
    }).attr("value");

    let fieldX = form.selectAll(`.X`).filter((e, i, n) => {
        return n[i].checked;
    }).attr("value");

    let fieldY = form.selectAll(`.Y`).filter((e, i, n) => {
        return n[i].checked;
    }).attr("value");

    let minMax = form.selectAll(`.MM`);
    let showMax = minMax.filter(`#max`).property(`checked`);
    let showMin = minMax.filter(`#min`).property(`checked`);
    if (!(showMax || showMin)) {
        alert("Необходимо выбрать хотя бы одно значение по оси Y");
        return;
    }

    // формируем массив для построения диаграммы
    let arrGraph = getArrGraph(table, fieldX, fieldY)
    let marginX = 100;
    let marginY = 100;
    let height = 800;
    let svg = d3.select("svg")
        .attr("height", height)
        .attr("width", `100%`);
    let width = svg.node().getBoundingClientRect().width;
    // очищаем svg перед построением
    svg.selectAll("*").remove();
    // определяем минимальное и максимальное значение по оси OY
    let min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
    let max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
    // определяем шкалы для осей
    let scaleX = d3.scaleBand()
        .domain(arrGraph.map(function (d) {
            return d.labelX;
        })
        )
        .range([0, xAxisLen], 1);
    let scaleY = d3.scaleLinear()
        .domain([min, max])
        .range([yAxisLen, 0]);
    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY);// вертикальная
    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .attr("class", "x-axis")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-45)";
        });
    // отображаем ось OY
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .attr("class", "y-axis")
        .call(axisY);
    // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
        .append("line") // добавляем линию
        .classed("grid-line", true) // добавляем класс
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", - (yAxisLen));
    // создаем горизонтальные линии сетки
    d3.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLen)
        .attr("y2", 0);

    if (type === "dot") {
        // отображаем данные в виде точечной диаграммы
        if (showMax) {
            svg.selectAll(".dot")
                .data(arrGraph)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) { return scaleX(d.labelX); })
                .attr("cy", function (d) { return scaleY(d.valueMax); })
                .attr("transform",
                    `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`)
                .style("fill", "red")
        }
        if (showMin) {
            svg.selectAll(".dot")
                .data(arrGraph)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) { return scaleX(d.labelX); })
                .attr("cy", function (d) { return scaleY(d.valueMin); })
                .attr("transform",
                    `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`)
                .style("fill", "blue")
        }
    }
    else if (type === "column") {
        let w = (xAxisLen / arrGraph.length - 5) / ((showMax && showMin) ? 2 : 1);
        let a = (showMax && showMin) ? w : w / 2;
        // отображаем данные в виде столбчатой диаграммы
        if (showMax) {
            svg.selectAll(".rect")
                .data(arrGraph)
                .enter()
                .append("rect")
                .attr("width", w)
                .attr("height", function (d) { return yAxisLen - scaleY(d.valueMax); })
                .attr("x", function (d) { return scaleX(d.labelX) - a; })
                .attr("y", function (d) { return scaleY(d.valueMax); })
                .attr("transform",
                    `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`)
                .style("fill", "red")
        }
        if (showMin) {
            svg.selectAll(".rect")
                .data(arrGraph)
                .enter()
                .append("rect")
                .attr("width", w)
                .attr("height", function (d) { return yAxisLen - scaleY(d.valueMin); })
                .attr("x", function (d) { return scaleX(d.labelX) - ((showMax && showMin) ? 0 : a); })
                .attr("y", function (d) { return scaleY(d.valueMin); })
                .attr("transform",
                    `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`)
                .style("fill", "blue")
        }
    }
}

d3.select(`#draw`).on(`click`, e => {
    _(e.target.form);
    drawGraph(e.target.form);
});

drawGraph(document.getElementById(`form`));
