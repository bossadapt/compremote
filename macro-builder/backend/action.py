class Action:
    name = ""
    keyboardActions = []
    mouseActions = []
    def __init__(self, name, keyboardActions, mouseActions):
        self.name = name
        self.keyboardActions = keyboardActions
        self.mouseActions = mouseActions
    def to_dict(self):
        return {
            "name": self.name,
            "keyboardActions": self.keyboardActions,
            "mouseActions": self.mouseActions
        }