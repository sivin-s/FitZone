export const TYPES = {
  IAdminRepository: Symbol.for("IAdminRepository"),
  IAdminService: Symbol.for("IAdminService"),
  IAdminController: Symbol.for("IAdminController"),
};
// inversify uses symbols (identifiers) to locate bindings at runtime.
