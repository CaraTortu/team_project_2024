"use client";
import { api } from "~/trpc/react";
import {
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
} from "recharts";

export default function Page() {
    const money_made = api.money.getIncome.useQuery();

    // Return the value with graphs and dropdowns for each clinic and doctor
    return (
        <div>
            {money_made.isLoading && <div>Loading...</div>}
            {money_made.isSuccess && (
                <div className="grid grid-cols-2 space-x-4 space-y-2 p-4">
                    <p className="col-span-2 pb-4 text-center text-3xl font-bold">
                        Total income for each clinic -{" "}
                        {money_made.data.total
                            .map((n) => n.clinic_income)
                            .reduce((acc, clinic) => clinic + acc)}€
                    </p>
                    {money_made.data.total.map((clinic) => (
                        <div
                            key={clinic.clinic}
                            className="rounded-xl border border-blue-600 bg-blue-100 py-3 text-black"
                        >
                            <h2 className="text-center text-xl font-bold italic">
                                {clinic.clinic} -{" "}
                                {clinic.doctor_income
                                    .map((n) => n.income || 0)
                                    .reduce((acc, n) => acc + n)}
                                €
                            </h2>
                            <ResponsiveContainer height={300} >
                                <BarChart data={clinic.doctor_income}>
                                    <XAxis dataKey="doctor" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                    <p className="col-span-2 pb-4 pt-12 text-center text-3xl font-bold">
                        Total income for each doctor this month - {" "}
                        {money_made.data.monthly
                            .map((n) => n.clinic_income)
                            .reduce((acc, clinic) => clinic + acc)}€

                    </p>
                    {money_made.data.monthly.map((clinic) => (
                        <div
                            key={clinic.clinic}
                            className="rounded-xl border border-blue-600 bg-blue-100 py-4 text-black"
                        >
                            <h2 className="text-center text-xl font-bold italic">
                                {clinic.clinic} -{" "}
                                {clinic.doctor_income
                                    .map((n) => n.income || 0)
                                    .reduce((acc, n) => acc + n)}
                                €
                            </h2>
                            <ResponsiveContainer height={300}>
                                <BarChart data={clinic.doctor_income}>
                                    <XAxis dataKey="doctor" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
