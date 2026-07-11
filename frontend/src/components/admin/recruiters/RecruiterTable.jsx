import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { recruiterTableColumns } from "../../helper/tableColumn";

const RecruiterTable = ({ recruiters, pagination }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 1);

  const tableRecords = recruiters?.map((item) => {
    return {
      id: item.userId,
      username: item.username,
      email: item.email,
    };
  });

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);

    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  return (
    <div>
      <div className="max-w-fit mx-auto">
        <DataGrid
          className="w-full"
          rows={tableRecords}
          paginationMode="server"
          rowCount={pagination?.totalElements || 0}
          columns={recruiterTableColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pagination?.pageSize || 10,
                page: currentPage - 1,
              },
            },
          }}
          onPaginationModelChange={handlePaginationChange}
          disableRowSelectionOnClick
          disableColumnResize
          pagination
          pageSizeOptions={[pagination?.pageSize || 10]}
          paginationOptions={{
            showFirstButton: true,
            showLastButton: true,
            hideNextButton: currentPage === pagination?.totalPages,
          }}
        />
      </div>
    </div>
  );
};

export default RecruiterTable;