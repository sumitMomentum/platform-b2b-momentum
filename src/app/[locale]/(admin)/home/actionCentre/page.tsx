import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";

const ActionCentre = async () => {
  const t = await getTranslations("AdminLayout.pages.actionCentre");

  const actionItems = [
    {
      vehicleNo: "ABC12378",
      severity: "High",
      importance: "H",
      description: "Lorem ipsum dolor sit amet",
      bestPractice: "Lorem ipsum dolor sit amet",
      actionToBeTaken: "charge",
      confirmButtonAction: "Close",
      createdDate: "2024-05-27",
      closedDate: "2024-05-28",
      dueDate: "2024-06-10",
    },
    {
      vehicleNo: "XYZ78967",
      severity: "Medium",
      importance: "M",
      description: "Sed do eiusmod tempor",
      bestPractice: "Sed do eiusmod tempor",
      actionToBeTaken: "change battery",
      confirmButtonAction: "Close",
      createdDate: "2024-05-26",
      closedDate: "2024-05-28",
      dueDate: "2024-06-05",
    },
    {
      vehicleNo: "DEF45656",
      severity: "Low",
      importance: "L",
      description: "Ut enim ad minim veniam",
      bestPractice: "Ut enim ad minim veniam",
      actionToBeTaken: "charge",
      confirmButtonAction: "Close",
      createdDate: "2024-05-25",
      closedDate: "2024-05-28",
      dueDate: "2024-06-15",
    },
  ];

  return (
    <div>
      <PageName
        name={t("title")}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Action Centre", href: "/home/actionCentre" },
        ]}
      />
      <div className="container">
        {/* <h2 className="text-2xl font-bold mb-4">Action Center</h2> */}
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">Vehicle No</th>
              <th className="border px-2 py-2">Severity</th>
              {/* <th className="px-2 py-2">Importance</th> */}
              <th className="border px-2 py-2">Description</th>
              <th className="border px-2 py-2">Best Practice</th>
              <th className="border px-2 py-2">Action To be Taken</th>
              <th className="border px-2 py-2">Confirm</th>
              <th className="border px-2 py-2">Created Date</th>
              <th className="border px-2 py-2">Closed Date</th>
              <th className="border px-2 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {actionItems.map((actionItem, index) => (
              <tr key={index} className="text-sm">
                <td className="border px-4 py-2">{actionItem.vehicleNo}</td>
                <td className="border px-4 py-2">{actionItem.severity}</td>
                {/* <td className="border px-4 py-2">{actionItem.importance}</td> */}
                <td className="border px-4 py-2">{actionItem.description}</td>
                <td className="border px-4 py-2">{actionItem.bestPractice}</td>
                <td className="border px-4 py-2">
                  {actionItem.actionToBeTaken}
                </td>

                {/* <td className="border px-4 py-2">
                {actionItem.confirmButtonAction}
              </td> */}
                <td className="border flex justify-center items-center">
                  <button className="bg-green-500 p-2 px-8 hover:bg-green-800">
                    Confirm Action Close
                  </button>
                </td>
                <td className="border px-4 py-2">{actionItem.createdDate}</td>
                <td className="border px-4 py-2">{actionItem.closedDate}</td>
                <td className="border px-4 py-2">{actionItem.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionCentre;
