import { utils } from '../../lib/utils.service';

class CreatedAtCreationStringService {




    createString(params: { range: 'general' | 'yearly' | 'monthly' | 'weekly' | 'range' | 'day' | string, date?: string, date_start?: string, date_end?: string, table_field: string }): string {

        const date_analysis = (params?.date || utils.moment(new Date()).format('YYYY/MM/DD')).split('/');
        // date format: YYYY/MM/DD
        //          -->             [0] -> YYYY     [1] -> MM       [2] -> DD

        const months_30 = [4, 6, 9, 11];
        const months_31 = [1, 3, 5, 7, 8, 10, 12];

        let created_at_string = '';


        if (params.range === 'general')
            return '';
        else if (params.range === 'yearly')
            created_at_string = `${params.table_field} LIKE '%%${date_analysis[0]}-%%'`;
        else if (params.range === 'monthly')
            created_at_string = `${params.table_field} LIKE '%%${date_analysis[0]}-${date_analysis[1]}-%%'`;
        else if (params.range === 'weekly') {

            const week_days: {
                start_date: string[];
                end_date: string[];
            } = {
                start_date: utils.moment(params.date).startOf('week').format('YYYY/MM/DD').split('/'),
                end_date: utils.moment(params.date).endOf('week').format('YYYY/MM/DD').split('/')
            };


            if (week_days.start_date[1] === week_days.end_date[1])
                for (let i = Number(week_days.start_date[2]); i <= Number(week_days.end_date[2]); i++) {
                    const day = i < 10 ? `0${i}` : `${i}`;
                    created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${week_days.start_date[1]}-${day}%%' `;
                }
            else {

                let total_week_days = 7;

                if (months_30.includes(Number(week_days.start_date[1])) && Number(week_days.start_date[2]) > 24) {

                    for (let i = Number(week_days.start_date[2]); i <= 30; i++) {
                        total_week_days--;
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${week_days.start_date[1]}-${i}%%' `;
                    }

                    for (let i = 1; i <= total_week_days; i++)
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${Number(week_days.start_date[1]) + 1}-0${i}%%' `;

                } else if (months_31.includes(Number(week_days.start_date[1])) && Number(week_days.start_date[2]) > 25) {

                    for (let i = Number(week_days.start_date[2]); i <= 31; i++) {
                        total_week_days--;
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${week_days.start_date[1]}-${i}%%' `;
                    }

                    if (Number(week_days.start_date[1]) < 12)
                        for (let i = 1; i <= total_week_days; i++)
                            created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${Number(week_days.start_date[1]) + 1}-${i}%%' `;
                    else
                        for (let i = 1; i <= total_week_days; i++)
                            created_at_string += `OR ${params.table_field} LIKE '%%${Number(week_days.start_date[0]) + 1}-01-0${i}%%' `;

                } else if (Number(week_days.start_date[1]) === 2 && Number(week_days.start_date[2]) > 22 && !(Number(week_days.start_date[0]) % 4 === 0 && Number(week_days.start_date[0]) % 100 === 0 && Number(week_days.start_date[0]) % 400 === 0)) {

                    for (let i = Number(week_days.start_date[2]); i <= 28; i++) {
                        total_week_days--;
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${week_days.start_date[1]}-${i}%%' `;
                    }

                    for (let i = 1; i < total_week_days; i++)
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${Number(week_days.start_date[1]) + 1}-0${i}%%' `;

                } else if (Number(week_days.start_date[1]) === 2 && Number(week_days.start_date[2]) > 23 && Number(week_days.start_date[0]) % 4 === 0 && Number(week_days.start_date[0]) % 100 === 0 && Number(week_days.start_date[0]) % 400 === 0) {

                    for (let i = Number(week_days.start_date[2]); i <= 29; i++) {
                        total_week_days--;
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${week_days.start_date[1]}-${i}%%' `;
                    }

                    for (let i = 1; i < total_week_days; i++)
                        created_at_string += `OR ${params.table_field} LIKE '%%${week_days.start_date[0]}-${Number(week_days.start_date[1]) + 1}-0${i}%%' `;

                }

            }


            created_at_string = created_at_string.replace(/^.{3}/g, '');

        } else if (params.range === 'range') {

            const total_days = (new Date(params.date_end).getTime() - new Date(params.date_start).getTime()) / (1000 * 3600 * 24);
            const start_date_analysis = params.date_start.split('/');
            const end_date_analysis = params.date_end.split('/');

            const date_splitted: {
                day: number;
                month: number;
                year: number;
            } = {
                day: Number(start_date_analysis[2]),
                month: Number(start_date_analysis[1]),
                year: Number(start_date_analysis[0]),
            };


            if (date_splitted.month > Number(end_date_analysis[1]))
                return '';


            for (let i = 0; i <= total_days; i++)
                if ((months_30.includes(date_splitted.month) && date_splitted.day === 30)
                    || (months_31.includes(date_splitted.month) && date_splitted.day === 31)
                    || (Number(date_analysis[1]) === 2 && Number(date_analysis[2]) === 28 && !(Number(date_analysis[0]) % 4 === 0 && Number(date_analysis[0]) % 100 === 0 && Number(date_analysis[0]) % 400 === 0))
                    || (Number(date_analysis[1]) === 2 && Number(date_analysis[2]) === 29 && Number(date_analysis[0]) % 4 === 0 && Number(date_analysis[0]) % 100 === 0 && Number(date_analysis[0]) % 400 === 0)) {

                    created_at_string += `OR ${params.table_field} LIKE '%%${date_splitted.year}-${date_splitted.month}-${date_splitted.day}%%' `;
                    date_splitted.day = 1;
                    date_splitted.month++;

                    if (date_splitted.month === 13) {
                        date_splitted.month = 1;
                        date_splitted.year++;
                    }

                } else {
                    const day = date_splitted.day < 10 ? `0${date_splitted.day}` : `${date_splitted.day}`;
                    const month = date_splitted.month < 10 ? `0${date_splitted.month}` : `${date_splitted.month}`;

                    created_at_string += `OR ${params.table_field} LIKE '%%${date_splitted.year}-${date_splitted.month}-${date_splitted.day}%%'`;
                }


            created_at_string = created_at_string.replace(/^.{3}/g, '');

        } else if (params.range === 'day') {
            const day = Number(date_analysis[2]) < 10 ? `0${date_analysis[2]}` : `${date_analysis[2]}`;
            const month = Number(date_analysis[1]) < 10 ? `0${date_analysis[1]}` : `${date_analysis[1]}`;

            created_at_string = `${params.table_field} LIKE '%%${date_analysis[0]}-${month}-${day}%%'`;
        }





        return created_at_string;

    }




}



const createdAtCreationStringService = new CreatedAtCreationStringService();
export { createdAtCreationStringService };
