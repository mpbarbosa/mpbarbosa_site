/**
 * Modelo de exemplo para Vaga
 * Este arquivo serve como modelo para definir estruturas de dados
 */
export default class Vaga {
  constructor(data) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.descricao = data.descricao;
    this.hotel = data.hotel;
    this.sindicato = data.sindicato;
    this.localizacao = data.localizacao;
    this.salario = data.salario;
    this.requisitos = data.requisitos;
    this.dataCriacao = data.dataCriacao || new Date();
  }

  /**
   * Valida os dados da vaga
   */
  validar() {
    if (!this.titulo) throw new Error('Título é obrigatório');
    if (!this.hotel) throw new Error('Hotel é obrigatório');
    if (!this.sindicato) throw new Error('Sindicato é obrigatório');
    return true;
  }
}
