import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import styles from "./checkout.module.scss";
import { useCart } from "../../context/CartContext";
import Header from "../../components/Header";
import PageTitle from "../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";

type CheckoutFormData = {
  name: string;
  email: string;
  address: string;
  street: string;
  state: string;
  neighborhood: string;
  number: number;
  city: string;
  zip: string;
  cardNumber: string;
  expirationDate: Date;
  cvv: string;
};

type State = {
  id: number;
  sigla: string;
  nome: string;
};

function Checkout() {
  const { items, totalPoints } = useCart();
  const [states, setStates] = useState<State[]>([]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const onSubmit: SubmitHandler<CheckoutFormData> = (data) => {
    const checkoutData = {
      ...data,
      items,
      totalPoints,
    };
    console.log("Form data:", checkoutData);
    // Lógica de checkout aqui
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 0) {
      navigate("/");
    }

    const fetchStates = async () => {
      try {
        const response = await api.get("/states");
        const { data } = response;
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    fetchStates();
  }, []);

  return (
    <>
      <Header isCheckout={true} />
      <div className={styles.container}>
        <PageTitle title="Checkout" redirect={"/"} />
        <section className={styles.row}>
          <form
            className={styles.checkoutForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input
                id="name"
                {...register("name", { required: "Nome é obrigatório" })}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email é obrigatório" })}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
            <div className={styles.rowForm}>
              <div className={`${styles.formGroup} ${styles.addressGroup}`}>
                <label htmlFor="street">Rua</label>
                <input
                  id="street"
                  {...register("street", { required: "Rua é obrigatória" })}
                />
                {errors.street && (
                  <p className={styles.error}>{errors.street.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="neighborhood">Bairro</label>
                <input
                  id="neighborhood"
                  {...register("neighborhood", {
                    required: "Bairro é obrigatório",
                  })}
                />
                {errors.neighborhood && (
                  <p className={styles.error}>{errors.neighborhood.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="number">Número</label>
                <input
                  id="number"
                  type="number"
                  pattern="\d*"
                  {...register("number", { required: "Número é obrigatório" })}
                />
                {errors.number && (
                  <p className={styles.error}>{errors.number.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">Cidade</label>
                <input
                  id="city"
                  {...register("city", { required: "Cidade é obrigatória" })}
                />
                {errors.city && (
                  <p className={styles.error}>{errors.city.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">Estado</label>
                <select
                  id="state"
                  {...register("state", { required: "Estado é obrigatório" })}
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.sigla}>
                      {state.nome}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className={styles.error}>{errors.state.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zip">CEP</label>
                <input
                  id="zip"
                  type="number"
                  {...register("zip", { required: "CEP é obrigatório" })}
                />
                {errors.zip && (
                  <p className={styles.error}>{errors.zip.message}</p>
                )}
              </div>
            </div>

            <div className={styles.rowForm}>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Número do Cartão</label>
                <input
                  id="cardNumber"
                  type="number"
                  pattern="\d*"
                  {...register("cardNumber", {
                    required: "Número do cartão é obrigatório",
                  })}
                />
                {errors.cardNumber && (
                  <p className={styles.error}>{errors.cardNumber.message}</p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expirationDate">Data de Expiração</label>
                <Controller
                  name="expirationDate"
                  control={control}
                  rules={{ required: "Data de expiração é obrigatória" }}
                  render={({ field }: any) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="MM/yyyy"
                      locale={ptBR}
                      showMonthYearPicker
                      showFullMonthYearPicker
                      placeholderText="MM/YYYY"
                      className={styles.datePicker}
                    />
                  )}
                />
                {errors.expirationDate && (
                  <p className={styles.error}>
                    {errors.expirationDate.message}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="number"
                  pattern="\d*"
                  {...register("cvv", { required: "CVV é obrigatório" })}
                />
                {errors.cvv && (
                  <p className={styles.error}>{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <button type="submit" className={styles.checkoutButton}>
              Finalizar Compra
            </button>
          </form>

          <div className={styles.orderSummary}>
            <h3>Resumo do Pedido</h3>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span>{item.name}: </span>
                <span>
                  {item.qnt} x {item.price} pts
                </span>
              </div>
            ))}
            <div className={styles.total}>
              <strong>Total:</strong>
              <strong>{totalPoints} pts</strong>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Checkout;
