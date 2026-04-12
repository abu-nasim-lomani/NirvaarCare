import PersonnelTable from "@/components/admin/PersonnelTable";

export default function PartnersPage() {
    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partner Coordination</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage Diagnostic Centers and Affiliates. Create partner access accounts for external coordination.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:p-8">
                <PersonnelTable roleName="partner" />
            </div>
        </div>
    );
}
