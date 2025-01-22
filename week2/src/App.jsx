import axios from "axios";
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/week2.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false); // 使用者未登入時用 false 狀態、渲染登入頁面，登入成功後改成 true、渲染產品頁面
  const [isAuthState, setIsAuthState] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [tempProduct, setTempProduct] = useState({});
  const [productList, setProductList] = useState([]);

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });

  const handleInputChange = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.name); // 可以用於辨別目前是哪一個 input 正在輸入內容

    const { value, name } = e.target;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault(); // 取消 form 表單的預設行為
    // console.log(account);
    // console.log(import.meta.env.VITE_BASE_URL);
    // console.log(import.meta.env.VITE_API_PATH);
    axios
      .post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        // console.log(res);
        const { token, expired } = res.data;
        // console.log(token, expired);
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

        axios.defaults.headers.common["Authorization"] = token;

        // axios
        //   .get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
        //   .then((res) => {
        //     setProductList(res.data.products);
        //   })
        //   .catch((err) => console.error(err));

        axios
          .get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
          .then((res) => {
            setIsAdmin(true);
            setProductList(res.data.products);
          })
          .catch((err) => {
            console.error(err);
            setIsAdmin(false);
          });

        setIsAuth(true);
      })
      .catch((err) => {
        console.error(err);
        alert("登入失敗");
      });
  };

  // 助教教學程式碼
  // const checkUserLogin = () => {
  //   axios
  //     .post(`${BASE_URL}/v2/api/user/check`)
  //     .then((res) => alert("使用者已登入"))
  //     .catch((err) => console.error(err))
  // };

  // 改寫後的程式碼
  const checkUserLogin = () => {
    axios
      .post(`${BASE_URL}/v2/api/user/check`)
      .then((res) => {
        alert("使用者已登入");
        setIsAuthState(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <div className="d-flex align-items-center mb-5">
            <button
              type="button"
              className="btn btn-success me-3"
              onClick={checkUserLogin}
            >
              驗證登入
            </button>
            {isAuthState ? (
              <p className="m-0 fw-bold text-success">使用者已登入</p>
            ) : (
              <p className="m-0 fw-bold">請點擊按鈕驗證使用者登入狀態</p>
            )}
          </div>
          <div className="row">
            <div className="col-md-6">
              <h2 className="mb-3">產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdmin ? (
                    productList.map((product) => (
                      <tr key={product.id}>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setTempProduct(product);
                            }}
                            className="btn btn-primary"
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan="5">
                        <p class="text-center text-secondary my-2">
                          目前沒有產品
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2 className="mb-3">單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">
                      {tempProduct.title}
                      <span className="badge text-bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text">
                      <del className="text-secondary">
                        {tempProduct.origin_price} 元
                      </del>{" "}
                      / {tempProduct.price} 元
                    </p>
                    <h5 className="card-title">更多圖片:</h5>
                    {tempProduct.imagesUrl?.map((image, index) => {
                      return <img className="images" src={image} key={index} />;
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                name="username"
                value={account.username}
                onChange={handleInputChange}
              />
              <label htmlFor="username">信箱</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                value={account.password}
                onChange={handleInputChange}
              />
              <label htmlFor="password">密碼</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
