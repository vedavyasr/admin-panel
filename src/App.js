import Table from "./components/table";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const tableHeaders = ["Name", "Email", "Role", "Actions"];
  const [deleteRows, setDeleteRow] = useState([]);
  const [allCheck, setAllChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
        );
        const apiData = await response.json();
        setIsFetching(false);
        setData(apiData);
        setActiveData(apiData.slice(0, limit));
      } catch (err) {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [limit]);

  useEffect(() => {
    let contextData = searchValue.length ? searchData : data;
    setTotalPages(Math.ceil(contextData.length / limit));
  }, [data, limit, searchData, searchValue.length]);

  useEffect(() => {
    let contextData = searchValue.length ? searchData : data;
    if (page > 1) {
      setActiveData(contextData.slice((page - 1) * limit, page * limit));
    } else {
      setActiveData(contextData.slice(page - 1, limit));
    }
  }, [activeData.length, data, limit, page, searchData, searchValue]);

  const onChangeHandler = (row, key, value) => {
    setActiveData((state) =>
      state.filter((val) => {
        if (val.id === row.id) val[key] = value;
        return val;
      })
    );
    setData((state) =>
      state.filter((val) => {
        if (val.id === row.id) val[key] = value;
        return val;
      })
    );
  };

  const onDeleteHandler = (rowIds) => {
    setAllChecked(false);
    setData((state) => state.filter((val) => !rowIds.includes(val.id)));
    setActiveData((state) => state.filter((val) => !rowIds.includes(val.id)));
  };

  const renderPages = (pages) => {
    let pageSpan = [];
    pageSpan.push(
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        {"<<"}
      </button>
    );
    for (let i = 1; i <= pages; i++) {
      pageSpan.push(<button onClick={() => setPage(i)}> {i}</button>);
    }
    pageSpan.push(
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        {">>"}
      </button>
    );
    return pageSpan;
  };

  const searchHandler = (searchData, data) => {
    const nameSearchData = data.filter((val) => val.name.includes(searchData));
    const emailSearchData = data.filter((val) =>
      val.email.includes(searchData)
    );
    const roleSearchData = data.filter((val) => val.role.includes(searchData));
    const searchResult = [
      ...nameSearchData,
      ...emailSearchData,
      ...roleSearchData,
    ];
    // remove duplicate data
    setSearchData(
      searchResult.reduce((acc, val) => {
        if (!acc.find((v) => v.id === val.id)) {
          acc.push(val);
        }
        return acc;
      }, [])
    );
  };

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, delay);
    };
  }

  const delaySearch = useCallback(debounce(searchHandler, 300), []);
  return (
    <div className='container'>
      <input
        type="search"
        className="search-bar"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          delaySearch(e.target.value, data);
          if (!e.target.value) setSearchData([]);
        }}
        placeholder="Search with Name/Email/Role"
      />
      {!isFetching ? (
        <Table
          tableHeaders={tableHeaders}
          data={activeData}
          onChangeHandler={onChangeHandler}
          onDeleteHandler={onDeleteHandler}
          deleteRows={deleteRows}
          setDeleteRow={setDeleteRow}
          setAllChecked={setAllChecked}
          allCheck={allCheck}
        />
      ) : (
        <span>Loading...</span>
      )}
      {searchValue && searchData.length === 0 && <span>No Results Found</span>}
      <div className={deleteRows.length === 0 ? "display-hidden" : null}>
        <button onClick={() => onDeleteHandler(deleteRows)}>
          Delete Selected
        </button>
      </div>
      <div>
        {renderPages(totalPages)}
        {`Page: ` + page + `of` + totalPages}
      </div>
    </div>
  );
}

export default App;
