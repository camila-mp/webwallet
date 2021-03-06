import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { excludeExpense } from '../actions';
// link consultado para aprender a fazer a tabela: https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

class WalletTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(id) {
    const { exclude, calculateExpenses } = this.props;
    await exclude(id);
    calculateExpenses();
  }

  renderTableHeader() {
    const header = [
      'Descrição', 'Tag', 'Método de pagamento', 'Valor', 'Moeda', 'Câmbio utilizado',
      'Valor convertido', 'Moeda de conversão', 'Excluir'];
    return header.map((columnName) => <th key={ columnName }>{ columnName }</th>);
  }

  renderTableInfo() {
    const { expenses } = this.props;
    if (expenses.length > 0) {
      return (
        expenses.map((item) => (
          <tr key={ item.id }>
            <td>{ item.description }</td>
            <td>{ item.tag }</td>
            <td>{ item.method }</td>
            <td>{ (+item.value) }</td>
            <td>{ item.exchangeRates[item.currency].name.split('/')[0] }</td>
            <td>{ (+item.exchangeRates[item.currency].ask).toFixed(2) }</td>
            <td>{ (item.exchangeRates[item.currency].ask * item.value).toFixed(2) }</td>
            <td>Real</td>
            <td>
              <button
                type="button"
                data-testid="delete-btn"
                className="delete-button"
                onClick={ () => this.handleClick(item.id) }
              >
                Excluir
              </button>

            </td>
          </tr>))
      );
    }
  }

  render() {
    return (
      <table className="expenses-table">
        <tbody>
          <tr>{ this.renderTableHeader() }</tr>
          {this.renderTableInfo()}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({
  expenses: wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  exclude: (id) => dispatch(excludeExpense(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletTable);

WalletTable.propTypes = {
  calculateExpenses: propTypes.func.isRequired,
  expenses: propTypes.arrayOf(propTypes.object).isRequired,
  exclude: propTypes.func.isRequired,
};
