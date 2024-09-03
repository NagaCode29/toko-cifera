const ctx = document.getElementById('myChart');

(async ()=>{
    try{
        const response = await fetch('/orders/total-paid-in-week');
        const totalPaidInWeek = await response.json();

        const responseTotalSales = await fetch('/orders/total-sales-in-week');
        const totalSales = await responseTotalSales.json();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [moment().subtract(5,'days').format('DD/MM'), moment().subtract(4,'days').format('DD/MM'), moment().subtract(3,'days').format('DD/MM'), moment().subtract(2,'days').format('DD/MM'), moment().subtract(1,'days').format('DD/MM'), moment().format('DD/MM')],
                datasets: [
                    {
                        label: 'Total',
                        data: totalSales,
                        borderWidth: 2
                    }, {
                        label: 'Total Paid',
                        data: totalPaidInWeek,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }catch (e) {
        alert('Gagal memuat data');
    }
})()