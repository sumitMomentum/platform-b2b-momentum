import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React  from "react";
// import React, { toLocaleString } from "react";
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

const ActionCentre = async () => {
  const t = await getTranslations("AdminLayout.pages.actionCentre");

  const actionItems = await getAllVehicleActions();
  console.log(actionItems);
  // const actionItems = [
  //   {
  //     vehicleNo: "ABC12378",
  //     severity: "High",
  //     importance: "H",
  //     description: "Lorem ipsum dolor sit amet",
  //     bestPractice: "Lorem ipsum dolor sit amet",
  //     actionToBeTaken: "charge",
  //     confirmButtonAction: "Close",
  //     createdDate: "2024-05-27",
  //     closedDate: "2024-05-28",
  //     dueDate: "2024-06-10",
  //   },
  //   {
  //     vehicleNo: "XYZ78967",
  //     severity: "Medium",
  //     importance: "M",
  //     description: "Sed do eiusmod tempor",
  //     bestPractice: "Sed do eiusmod tempor",
  //     actionToBeTaken: "change battery",
  //     confirmButtonAction: "Close",
  //     createdDate: "2024-05-26",
  //     closedDate: "2024-05-28",
  //     dueDate: "2024-06-05",
  //   },
  //   {
  //     vehicleNo: "DEF45656",
  //     severity: "Low",
  //     importance: "L",
  //     description: "Ut enim ad minim veniam",
  //     bestPractice: "Ut enim ad minim veniam",
  //     actionToBeTaken: "charge",
  //     confirmButtonAction: "Close",
  //     createdDate: "2024-05-25",
  //     closedDate: "2024-05-28",
  //     dueDate: "2024-06-15",
  //   },
  // ];

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
        <div className="max-h-screen overflow-y-auto">
          {" "}
          {/* Container for scrolling */}
          <table className="table-auto w-full">
            <thead className="bg-gray-100 sticky top-0">
              {" "}
              {/* Sticky header */}
              <tr>
                <th className="border px-2 py-2">VIN</th>
                <th className="border px-2 py-2">Severity</th>
                {/* <th className="px-2 py-2">Importance</th> */}
                <th className="border px-2 py-2">Description</th>
                <th className="border px-2 py-2">Best Practice</th>
                <th className="border px-2 py-2">Action To be Taken</th>
                <th className="border px-2 py-2">Confirm</th>
                <th className="border px-2 py-2">Created Date</th>
                <th className="border px-2 py-2">Closed Date</th>
                {/* <th className="border px-2 py-2">Due Date</th> */}
              </tr>
            </thead>
            <tbody>
              {actionItems.map((actionItem, index) => (
                <tr key={index} className="text-sm">
                  <td className="border px-4 py-2">{actionItem.vin}</td>
                  <td
                    className={`border px-4 py-2 ${
                      actionItem.severity === "High"
                        ? "bg-red-500 hover:bg-red-700 text-white"
                        : actionItem.severity === "Medium"
                        ? "bg-yellow-400 hover:bg-yellow-600 text-gray-800"
                        : "bg-green-500 hover:bg-green-700 text-white"
                    }`}
                  >
                    {actionItem.severity}
                  </td>
                  {/* <td className="border px-4 py-2">{actionItem.importance}</td> */}
                  <td className="border px-4 py-2">{actionItem.description}</td>
                  <td className="border px-4 py-2">
                    {actionItem.bestPractice}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.actionToBeTaken}
                  </td>

                  {/* <td className="border px-4 py-2">
                {actionItem.confirmButtonAction}
              </td> */}
                  <td className="border flex justify-center items-center">
                    <button className="bg-gray-500 p-2 px-8 hover:bg-gray-800 text-white">
                      Action {actionItem.confirm ? "Closed" : "Pending"}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(
                      Date.parse(actionItem.CreatedDateTime)
                    ).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 bg-green-600 hover:bg-green-800  text-white">
                    {new Date(
                      Date.parse(actionItem.ClosedDateTime)
                    ).toLocaleString()}
                  </td>
                  {/* <td className="border px-4 py-2 ">{actionItem.dueDate}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActionCentre;
